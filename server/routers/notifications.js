const express = require('express');
const { mongoose } = require('../utilities/connection');
const { isLoggedIn } = require('../utilities/isloggedin');
const { PostSchema } = require('../schemas/post');
const { UserSchema } = require('../schemas/user');
const { CommentSchema } = require('../schemas/comments');
const { notificationSchema } = require('../schemas/notification');
const { unseenNotificationSchema } = require('../schemas/notificationUnseen');
const router = express.Router();
router.use(express.urlencoded({ extended: true }))
router.use(express.json());


router.get("/getall", isLoggedIn, async (req, res) => {
    try {
        const usermodel = mongoose.model("users", UserSchema);
        const notificationmodel = mongoose.model("notifications", notificationSchema);
        const unseenNotifmodel = mongoose.model("unseennotifications", unseenNotificationSchema);
        const user = await usermodel.findOne({ _id: req.session.login });

        const arrayofnotification = await notificationmodel.find({ for_author: user })
            .populate('from_author', 'username').sort({date: -1});
        const count = await unseenNotifmodel.countDocuments({ for_author: user });
        res.status(200).json({ data: arrayofnotification, unseenNotificationsCount: count });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "something went wrong" });
    }
})
router.get("/markread", isLoggedIn, async (req, res) => {
    try {
        const usermodel = mongoose.model("users", UserSchema);
        const unseenNotifmodel = mongoose.model("unseennotifications", unseenNotificationSchema);
        const user = await usermodel.findOne({ _id: req.session.login });
        await unseenNotifmodel.deleteMany({ for_author: user });
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "something went wrong" });
    }
})


module.exports.router = router;