const express = require('express');
const multer = require('multer');
const { isLoggedIn } = require('../utilities/isloggedin');
const { mongoose } = require('../utilities/connection');
const { FollowSchema } = require('../schemas/follow');
const { CommentSchema } = require('../schemas/comments');
const { LikeSchema } = require('../schemas/likes');
const { PostSchema } = require('../schemas/post');
const { UserSchema } = require('../schemas/user');
const { postseenSchema } = require('../schemas/postseen');
const { getGfsBucketPromise } = require('../utilities/gfbucket');
const { notificationSchema } = require('../schemas/notification');
const { unseenNotificationSchema } = require('../schemas/notificationUnseen');
const { adminusersSchema } = require("../schemas/adminusers");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/getall', async (req, res) => {
  try {
    const usermodel = new mongoose.model('users', UserSchema);
    const postmodel = new mongoose.model('posts', PostSchema);
    const commentmodel = new mongoose.model('comments', CommentSchema);
    const plainposts = await postmodel.find({}).populate('author', 'username');
    const allposts = plainposts.map(post => post.toObject());
    for (let i = 0; i < allposts.length; i++) {
      allposts[i].repostcount = await postmodel.countDocuments({repostid: allposts[i]});
      allposts[i].comments = await commentmodel.find({ postid: allposts[i]._id }).populate('author', 'username');
    }
    res.status(200).json(allposts);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

router.get('/feed', isLoggedIn, async (req, res) => {
  try {
    const followingmodel = mongoose.model("followers", FollowSchema);
    const usermodel = mongoose.model('users', UserSchema);
    const postmodel = mongoose.model('posts', PostSchema);
    const seenpostsmodel = mongoose.model("seenposts", postseenSchema);
    const commentmodel = mongoose.model('comments', CommentSchema);
    const user = await usermodel.findOne({ _id: req.session.login });
    const arrofposts = [];
    const seenposts = await seenpostsmodel.find({ author: user });
    const seenPostIds = seenposts.map(post => post.postid);
    const followingusers = await followingmodel.find({ follower: user });
    if (followingusers.length === 0) {
      res.status(404).json({ message: "No posts left to query" });
      return;
    }
    for (let i = 0; i < 5; i++) {
      const randomindex = Math.floor(Math.random() * followingusers.length);
      const currpost = await postmodel.findOne({ author: followingusers[randomindex], _id: { $nin: seenPostIds } }).populate('author', 'username');
      if (!currpost) {
        continue;
      }
      const arrofcomments = await commentmodel.find({ postid: currpost }).populate('author', 'username');
      const postwithcomments = currpost.toObject();
      postwithcomments.comments = arrofcomments;
      arrofposts.push(postwithcomments);
      const seenpost = new seenpostsmodel({
        author: user,
        postid: currpost,
      });
      await seenpost.save();
    }
    if (arrofposts.length === 0) {
      res.status(404).json({ message: "No posts left to query" });
      return;
    }
    res.status(200).json(arrofposts);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

router.get("/likedposts", isLoggedIn, async (req, res) => {
  const postmodel = mongoose.model('posts', PostSchema);
  const likedmodel = mongoose.model("likes", LikeSchema);
  try {
    const arroflikedposts = await likedmodel.find({ author: req.session.login });
    if (!arroflikedposts || arroflikedposts.length === 0) {
      return res.status(404).json({ message: "No liked posts found" });
    }
    const postIds = arroflikedposts.map(elm => elm.postid);
    const arrofposts = await postmodel.find({ _id: { $in: postIds } }).populate("author", "username email photoURL");
    res.status(200).json(arrofposts);
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    res.status(500).json({ error: "Failed to fetch liked posts" });
  }
});

router.get('/:id', isLoggedIn, async (req, res) => {
  try {
    const postmodel = mongoose.model('posts', PostSchema);
    const commentmodel = mongoose.model('comments', CommentSchema);
    const likedmodel = mongoose.model("likes", LikeSchema);
    const usermodel = mongoose.model('users', UserSchema);

    // Find the post
    const post = await postmodel.findOne({ _id: req.params.id }).populate("author", "username email");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const repostCount = await postmodel.countDocuments({repostid: post});

    // Find the user
    const user = await usermodel.findOne({ _id: req.session.login });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch comments
    const comments = await commentmodel.find({ postid: post._id }).populate('author', 'username');

    // Check if the post is liked by the user
    const isliked = await likedmodel.findOne({ author: user._id, postid: post._id });

    // Calculate likesCount dynamically
    const likesCount = await likedmodel.countDocuments({ postid: post._id });

    // Prepare the response
    const response = {
      ...post.toObject(),
      comments,
      isLiked: !!isliked,
      likesCount,
      repostCount,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
          return res.status(400).json({ error: "the post id is invalid" });
      const postmodel = mongoose.model('posts', PostSchema);
      const commentmodel = mongoose.model('comments', CommentSchema);
      const seenpostsmodel = mongoose.model("seenposts", postseenSchema);
      const adminmodel = mongoose.model('adminusers', adminusersSchema);

      const found = await postmodel.findOne({ _id: req.params.id, author: req.session.login });
      const isadmin = await adminmodel.findOne({ author: req.session.login });

      const gfbucket = await getGfsBucketPromise;
      if (found) {
          if (found.fileurl)
              await gfbucket.delete(new mongoose.Types.ObjectId(found.fileurl.split('/')[1]));
          await commentmodel.deleteMany({ postid: found });
          await seenpostsmodel.deleteMany({ postid: found });
          await postmodel.deleteMany({ repostid: found });
          await postmodel.deleteOne({ _id: req.params.id, author: req.session.login });

          res.status(200).json({ message: "success" });
      }
      else if (isadmin) {
          const thepost = await postmodel.findById(req.params.id);
          if (thepost.fileurl)
              await gfbucket.delete(new mongoose.Types.ObjectId(thepost.fileurl.split('/')[1]));
          await commentmodel.deleteMany({ postid: thepost });
          await seenpostsmodel.deleteMany({ postid: thepost });
          await postmodel.deleteMany({ repostid: thepost });
          await postmodel.deleteOne({ _id: req.params.id });
      }
      else
          res.status(400).json({ error: "post was not found" });

  } catch (error) {
      console.log('error', error);
      res.status(400).json({ error });
  }

})

router.post('/upload', isLoggedIn, upload.single('file'), async (req, res) => {
  try {
    const gfsBucket = await getGfsBucketPromise;
    const title = req.body.title;
    const usermodel = new mongoose.model('users', UserSchema);
    const user = await usermodel.findOne({ _id: req.session.login });
    const postmodel = new mongoose.model('posts', PostSchema);
    let url = "";
    let posttype = "text";
    let filetype = "";
    if (req.file) {
      const uploadStream = gfsBucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
        metadata: { author: user._id }
      });
      await uploadStream.end(req.file.buffer, () => { });
      url = `file/${uploadStream.id}`;
      posttype = 'file';
      filetype = `${req.file.mimetype}`;
      console.log('file uploaded');
    }
    const newpost = new postmodel({
      title,
      author: user,
      date: new Date(),
      fileurl: url,
      posttype,
      filetype,
      repost: false,
      repostid: null
    });
    await newpost.save();
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({ error });
  }
});

router.post('/:postid/repost', isLoggedIn, async (req, res) => {
  try {
      const { title } = req.body;
      const postid = req.params.postid;
      if (!mongoose.Types.ObjectId.isValid(postid))
          return res.status(400).json({ error: "the post id is invalid" });

      const usermodel = mongoose.model('users', UserSchema);
      const user = await usermodel.findOne({ _id: req.session.login });

      const postmodel = mongoose.model('posts', PostSchema);
      const repostedpost = await postmodel.findOne({ _id: postid });
      if (!repostedpost)
          return res.status(400).json({ error: "the post does not exist" });
      const newpost = new postmodel({
          author: user,
          title,
          date: new Date(),
          fileurl: "",
          posttype: "text",
          repost: true,
          repostid: repostedpost
      })
      await newpost.save();
      res.status(200).json({ message: "success" });

  } catch (error) {
      console.log('error', error);
      res.status(400).json({ error });
  }
})

router.get('/:id', isLoggedIn, async (req, res) => {
  try {
    const postmodel = mongoose.model('posts', PostSchema);
    const usermodel = mongoose.model('users', UserSchema);
    
    // Fetch user by the provided ID (from URL parameter)
    const user = await usermodel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find posts that belong to this user
    const posts = await postmodel.find({ author: user._id }).populate("author", "username email");
    if (!posts) {
      return res.status(404).json({ error: "No posts available" });
    }

    res.status(200).json(posts); // Return posts to the frontend
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.post('/:id/like', isLoggedIn, async (req, res) => {
  try {
    const postmodel = mongoose.model('posts', PostSchema);
    const likedmodel = mongoose.model('likes', LikeSchema);
    const usermodel = mongoose.model('users', UserSchema);
    const notificationmodel = mongoose.model('notifications', notificationSchema);
    const unseenNotifmodel = mongoose.model('unseennotifications', unseenNotificationSchema);

    // Find the post
    const post = await postmodel.findOne({ _id: req.params.id });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Find the user
    const user = await usermodel.findOne({ _id: req.session.login });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the post is already liked by the user
    const isliked = await likedmodel.findOne({ author: user._id, postid: post._id });

    if (isliked) {
      // Unlike the post
      await likedmodel.deleteOne({ author: user._id, postid: post._id });

      // Delete the like notification
      const oldNotification = await notificationmodel.findOne({
        from_author: user._id,
        notificationtype: 'like',
        postid: post._id,
      });

      if (oldNotification) {
        await unseenNotifmodel.deleteOne({ notificationid: oldNotification._id });
        await notificationmodel.deleteOne({ _id: oldNotification._id });
      }

      // Calculate the new likesCount
      const likesCount = await likedmodel.countDocuments({ postid: post._id });

      return res.status(200).json({ likesCount, isLiked: false });
    } else {
      // Like the post
      const newlike = new likedmodel({ author: user._id, postid: post._id });
      await newlike.save();

      // Create a new like notification
      const newNotification = new notificationmodel({
        for_author: post.author,
        from_author: user._id,
        notificationtype: 'like',
        postid: post._id,
        date: new Date(),
      });
      await newNotification.save();

      // Add the notification to the unseen notifications
      const newUnseenNotification = new unseenNotifmodel({
        for_author: post.author,
        notificationid: newNotification._id,
      });
      await newUnseenNotification.save();

      // Calculate the new likesCount
      const likesCount = await likedmodel.countDocuments({ postid: post._id });

      return res.status(200).json({ likesCount, isLiked: true });
    }
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    res.status(500).json({ error: "Failed to like/unlike post" });
  }
});

module.exports.router = router;