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
    const post = await postmodel.findOne({ _id: req.params.id }).populate("author", "username");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

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
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    const postmodel = mongoose.model('posts', PostSchema);
    const commentmodel = mongoose.model('comments', CommentSchema);
    const seenpostsmodel = mongoose.model("seenposts", postseenSchema);
    const found = await postmodel.findOne({ _id: req.params.id, author: req.session.login });
    const gfbucket = await getGfsBucketPromise;
    if (found) {
      if (found.fileurl)
        await gfbucket.delete(new mongoose.Types.ObjectId(found.fileurl.split('/')[1]));
      await commentmodel.deleteMany({ postid: found });
      await seenpostsmodel.deleteMany({ postid: found });
      await postmodel.deleteOne({ _id: req.params.id, author: req.session.login });
      res.status(200).json({ message: "success" });
    } else {
      res.status(400).json({ error: "Post was not found" });
    }
  } catch (error) {
    console.log('error', error);
    res.status(400).json({ error });
  }
});

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

router.post('/repost', isLoggedIn, async (req, res) => {
  try {
    const { title, postid } = req.body;
    const usermodel = new mongoose.model('users', UserSchema);
    const user = await usermodel.findOne({ _id: req.session.login });
    const postmodel = new mongoose.model('posts', PostSchema);
    const repostedpost = await postmodel.findOne({ _id: postid });
    const newpost = new postmodel({
      author: user,
      title,
      date: new Date(),
      fileurl: "",
      posttype: "text",
      repost: true,
      repostid: repostedpost
    });
    await newpost.save();
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({ error });
  }
});

router.post('/:id/like', isLoggedIn, async (req, res) => {
    try {
      const postmodel = mongoose.model('posts', PostSchema);
      const likedmodel = mongoose.model("likes", LikeSchema);
      const usermodel = mongoose.model("users", UserSchema);
  
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
  
        // Calculate the new likesCount
        const likesCount = await likedmodel.countDocuments({ postid: post._id });
  
        // Log the response
        console.log("Post unliked:", {
          likesCount,
          isLiked: false,
        });
  
        return res.status(200).json({ likesCount, isLiked: false });
      } else {
        // Like the post
        const newlike = new likedmodel({ author: user._id, postid: post._id });
        await newlike.save();
  
        // Calculate the new likesCount
        const likesCount = await likedmodel.countDocuments({ postid: post._id });
  
        // Log the response
        console.log("Post liked:", {
          likesCount,
          isLiked: true,
        });
  
        return res.status(200).json({ likesCount, isLiked: true });
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      res.status(500).json({ error: "Failed to like/unlike post" });
    }
  });
  
  router.delete('/:id/like', isLoggedIn, async (req, res) => {
    try {
      const postmodel = mongoose.model('posts', PostSchema);
      const likedmodel = mongoose.model("likes", LikeSchema);
      const usermodel = mongoose.model("users", UserSchema);
  
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
  
      // If the post is not liked, return an error
      if (!isliked) {
        return res.status(400).json({ error: "Post is already not liked" });
      }
  
      // Unlike the post (since it is already liked)
      await likedmodel.deleteOne({ author: user._id, postid: post._id });
  
      // Calculate the new likesCount
      const likesCount = await likedmodel.countDocuments({ postid: post._id });
  
      res.status(200).json({ likesCount, isLiked: false });
    } catch (error) {
      console.error("Error unliking post:", error);
      res.status(500).json({ error: "Failed to unlike post" });
    }
  });
  
  router.post('/:id/comment', isLoggedIn, async (req, res) => {
    console.log("Request body:", req.body); // Log the request body
    console.log("Request headers:", req.headers); // Log the headers
    try {
      const commentmodel = mongoose.model('comments', CommentSchema);
      const postmodel = mongoose.model('posts', PostSchema);
      const usermodel = mongoose.model('users', UserSchema);
  
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
  
      // Validate the comment text
      const { text } = req.body;
      console.log("Received text:", text); // Log the received text
      if (!text || typeof text !== 'string' || text.trim() === "") {
        return res.status(400).json({ error: "Comment text is required and cannot be empty" });
      }
  
      // Create the comment
      const newComment = new commentmodel({
        text: text.trim(), // Ensure no leading/trailing whitespace
        author: user._id,
        postid: post._id,
      });
      await newComment.save();
  
      // Fetch the updated list of comments
      const comments = await commentmodel.find({ postid: post._id }).populate('author', 'username');
  
      res.status(200).json({ comments });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Failed to add comment" });
    }
  });

  router.delete('/comments/:id', isLoggedIn, async (req, res) => {
    try {
      const commentmodel = mongoose.model('comments', CommentSchema);
      const usermodel = mongoose.model('users', UserSchema);
  
      // Find the comment
      const comment = await commentmodel.findOne({ _id: req.params.id });
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
  
      // Find the user
      const user = await usermodel.findOne({ _id: req.session.login });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Check if the user is the author of the comment
      if (comment.author.toString() !== user._id.toString()) {
        return res.status(403).json({ error: "You are not authorized to delete this comment" });
      }
  
      // Delete the comment
      await commentmodel.deleteOne({ _id: comment._id });
  
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });

module.exports.router = router;