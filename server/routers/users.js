const express = require('express');
const { mongoose } = require('../utilities/connection');
const { isLoggedIn } = require('../utilities/isloggedin');
const { UserSchema } = require('../schemas/user');
const { FollowSchema } = require('../schemas/follow');
const { PostSchema } = require('../schemas/post');
const { adminusersSchema } = require("../schemas/adminusers");
const { validatorSchema } = require("../schemas/validators");
const { preferenceSchema } = require('../schemas/preferences');
const { viewsSchema } = require('../schemas/views');
const router = express.Router();
router.use(express.urlencoded({ extended: true }))

// router.get("/:id/profile", isLoggedIn, async (req, res) => {
//     try {
//       const { id } = req.params;
//       console.log("Getting profile for ID:", id);
//       console.log("Logged in as:", req.session.userId);

//       // Define models consistently
//       const User = mongoose.model('users', UserSchema);
//       const Preferences = mongoose.model('preferences', preferenceSchema);
//       const Follow = mongoose.model('followers', FollowSchema);

//       const user = await User.findById(id).select("-password");
//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       const preferences = await Preferences.findOne({ user: id });

//       const followers = await Follow.countDocuments({ follows: id });  // Changed from 'following' to 'follows'
//       const following = await Follow.countDocuments({ follower: id });

//       const isFollowing = await Follow.exists({
//         follower: req.session.userId,
//         follows: id,  // Changed from 'following' to 'follows'
//       });

//       res.json({
//         user,
//         preferences,
//         followers,
//         following,
//         isFollowing: Boolean(isFollowing),
//       });
//     } catch (err) {
//       console.error("Error in /users/:id/profile:", err);
//       res.status(500).json({ error: "Server error" });
//     }
// });  

router.get("/myprofile", isLoggedIn, async (req, res) => {
  try {
    const usermodel = mongoose.model('users', UserSchema);
    const followmodel = mongoose.model('followers', FollowSchema);
    const preferencemodel = mongoose.model("preferences", preferenceSchema);
    const adminmodel = mongoose.model('adminusers', adminusersSchema);
    const validatormodel = mongoose.model('validatorusers', validatorSchema);
    const myinfo = await usermodel.findOne({ _id: req.session.login }).select("username isWriter firstname lastname email");
    const pref = await preferencemodel.findOne({ author: myinfo });
    const following = await followmodel.countDocuments({ follower: myinfo });
    const followers = await followmodel.countDocuments({ follows: myinfo });
    const isadmin = await adminmodel.findOne({ author: myinfo });
    const isvalidator = await validatormodel.findOne({ author: myinfo });
    res.status(200).json({ myinfo, following, followers, preferences: pref, isadmin: !!isadmin, isvalidator: !!isvalidator });
  } catch (error) {
    console.log(error);
  }
})


router.get('/allusers', async (req, res) => {
  const usermodel = new mongoose.model('users', UserSchema);
  const allusers = await usermodel.find({});
  res.status(200).json(allusers);
});

router.get('/:id', isLoggedIn, async (req, res) => {
  const usermodel = mongoose.model('users', UserSchema);
  const followmodel = mongoose.model('followers', FollowSchema);
  const preferencemodel = mongoose.model("preferences", preferenceSchema);
  const viewmodel = mongoose.model("views", viewsSchema);
  const user = await usermodel.findOne({ _id: req.params.id }).select('username isWriter');
  const pref = await preferencemodel.findOne({ author: user });
  const modifieduser = {}
  modifieduser.user = user;
  const countfollowing = await followmodel.countDocuments({ follower: req.params.id });
  const countfollowers = await followmodel.countDocuments({ follows: req.params.id });
  const found = await viewmodel.findById(req.params.id);
    if(!found){
        const newview = new viewmodel({
            author: user,
            count: 0
        })
        await newview.save();
    }
  await viewmodel.findOneAndUpdate({ author: user }, { $inc: { count: 1 } })
  modifieduser.user.follows = countfollowing;
  modifieduser.user.followers = countfollowers;
  modifieduser.preferences = pref;
  console.log(modifieduser)
  res.status(200).json(modifieduser);
})

router.get('/:id/posts', isLoggedIn, async (req, res) => {
  const usermodel = mongoose.model('users', UserSchema);
  const postsmodel = mongoose.model("posts", PostSchema);
  const user = await usermodel.findOne({ _id: req.params.id })
  arrofposts = await postsmodel.find({ author: user });
  res.status(200).json({ data: arrofposts });
})

router.get('/follow-status/:id', isLoggedIn, async (req, res) => {
  try {
    const usermodel = new mongoose.model('users', UserSchema);
    const followmodel = new mongoose.model('followers', FollowSchema);

    const currentuser = await usermodel.findById(req.session.login);
    const targetuser = await usermodel.findById(req.params.id);

    if (!currentuser || !targetuser) {
      return res.status(400).json({ error: 'Invalid users' });
    }

    const follow = await followmodel.findOne({ follower: currentuser, follows: targetuser });
    return res.status(200).json({ isFollowing: !!follow });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

//tested 3/7/2025
router.post('/follow/:id', isLoggedIn, async (req, res) => {
  try {
    const usermodel = new mongoose.model('users', UserSchema);
    const followmodel = new mongoose.model('followers', FollowSchema);

    const currentuser = await usermodel.findById(req.session.login);
    const targetuser = await usermodel.findById(req.params.id);

    if (!currentuser || !targetuser || currentuser._id.equals(targetuser._id)) {
      return res.status(400).json({ error: "Invalid follow request" });
    }

    const alreadyfollow = await followmodel.findOne({ follower: currentuser, follows: targetuser });

    if (!alreadyfollow) {
      const newfollow = new followmodel({ follower: currentuser, follows: targetuser });
      await newfollow.save();
    }

    return res.status(200).json({ message: 'Followed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});


// tested 3/7/2025
router.delete('/follow/:id', isLoggedIn, async (req, res) => {
  try {
    const usermodel = new mongoose.model('users', UserSchema);
    const followmodel = new mongoose.model('followers', FollowSchema);

    const currentuser = await usermodel.findById(req.session.login);
    const targetuser = await usermodel.findById(req.params.id);

    if (!currentuser || !targetuser) {
      return res.status(400).json({ error: "Invalid users" });
    }

    await followmodel.deleteOne({ follower: currentuser, follows: targetuser });
    return res.status(200).json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

//get followers and followings
router.get('/:id/followers', isLoggedIn, async (req, res) => {
  try {
    const followModel = mongoose.model('followers', FollowSchema);
    const userModel = mongoose.model('users', UserSchema);
    const preferenceModel = mongoose.model('preferences', preferenceSchema);

    const followers = await followModel
      .find({ follows: req.params.id })
      .populate({
        path: 'follower',
        select: 'username firstname lastname isWriter',
      });

    const users = await Promise.all(followers.map(async (entry) => {
      const pref = await preferenceModel.findOne({ author: entry.follower._id });
      return {
        ...entry.follower.toObject(),
        preferences: pref ? { profilepic: pref.profilepic } : {},
      };
    }));

    res.status(200).json({ data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/following', isLoggedIn, async (req, res) => {
  try {
    const followModel = mongoose.model('followers', FollowSchema);
    const userModel = mongoose.model('users', UserSchema);
    const preferenceModel = mongoose.model('preferences', preferenceSchema);

    const following = await followModel
      .find({ follower: req.params.id })
      .populate({
        path: 'follows',
        select: 'username firstname lastname isWriter',
      });

    const users = await Promise.all(following.map(async (entry) => {
      const pref = await preferenceModel.findOne({ author: entry.follows._id });
      return {
        ...entry.follows.toObject(),
        preferences: pref ? { profilepic: pref.profilepic } : {},
      };
    }));

    res.status(200).json({ data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});









module.exports.router = router;