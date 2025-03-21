const express = require('express');
const { mongoose } = require('../utilities/connection');
const { isLoggedIn } = require('../utilities/isloggedin');
const { UserSchema } = require('../schemas/user');
const { FollowSchema } = require('../schemas/follow');
const router = express.Router();
router.use(express.urlencoded({ extended: true }))

router.get("/myprofile", isLoggedIn, async (req, res) => {
    try {
        const usermodel = mongoose.model('users', UserSchema);
        const followmodel = mongoose.model('followers', FollowSchema);
        const myinfo = await usermodel.findOne({ _id: req.session.login }).select("username email isWriter");
        const following = await followmodel.countDocuments({ follower: myinfo });
        const followers = await followmodel.countDocuments({ follows: myinfo });
        res.status(200).json({ myinfo, following, followers });
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
    const user = await usermodel.findOne({ _id: req.params.id }).select('username isWriter email');
    if (!user)
        return res.status(404).json({ error: "profile not found" });
    const modifieduser = user.toObject();
    const countfollowing = await followmodel.countDocuments({ follower: req.params.id });
    const countfollowers = await followmodel.countDocuments({ follows: req.params.id });
    modifieduser.follows = countfollowing;
    modifieduser.followers = countfollowers;
    res.status(200).json(modifieduser);
})

//tested 3/7/2025
router.get('/follow/:id', isLoggedIn, async (req, res) => {
    try {
        const usermodel = new mongoose.model('users', UserSchema);
        const followmodel = new mongoose.model('followers', FollowSchema);
        const currentuser = await usermodel.findOne({ _id: req.session.login });
        const followinguser = await usermodel.findOne({ _id: req.params.id });
        const alreadyfollow = await followmodel.findOne({ follower: currentuser, follows: followinguser });

        if (req.session.login === req.params.id) {
            res.status(400).json({ error: "you cant follow yourself" });
            return;
        }
        if (alreadyfollow) {
            res.status(400).json({ error: "you are already following this user" });
            return;
        }
        if (!currentuser || !followinguser) {
            res.status(400).json({ error: "invalid follow request (one or more accounts does not exist)" });
            return;
        }

        const newfollowrow = new followmodel({
            follower: currentuser,
            follows: followinguser
        })
        await newfollowrow.save();
        res.status(200).json({ message: 'success' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
})

// tested 3/7/2025
router.delete('/follow/:id', isLoggedIn, async (req, res) => {
    try {
        const usermodel = new mongoose.model('users', UserSchema);
        const followmodel = new mongoose.model('followers', FollowSchema);
        const currentuser = await usermodel.findOne({ _id: req.session.login });
        const followinguser = await usermodel.findOne({ _id: req.params.id });
        if (!currentuser || !followinguser) {
            res.status(400).json({ error: "invalid follow request (one or more accounts does not exist)" });
            return;
        }
        const followrow = await followmodel.findOne({ follower: currentuser, follows: followinguser });
        if (!followrow) {
            res.status(400).json({ error: "you already dont follow this user" });
            return;
        }
        await followmodel.deleteOne({ follower: currentuser, follows: followinguser });

        res.status(200).json({ message: 'success' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
})





module.exports.router = router;