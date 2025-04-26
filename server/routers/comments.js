const express = require('express');
const { mongoose } = require('../utilities/connection');
const { isLoggedIn } = require('../utilities/isloggedin');
const { PostSchema } = require('../schemas/post');
const { UserSchema } = require('../schemas/user');
const { CommentSchema } = require('../schemas/comments');
const { notificationSchema } = require('../schemas/notification');
const { unseenNotificationSchema } = require('../schemas/notificationUnseen');
const router = express.Router();
router.use(express.urlencoded({extended: true}))
router.use(express.json());




router.get('/:postid/comments', isLoggedIn, async (req, res) => {
    try {
        const commentModel = new mongoose.model('comments', CommentSchema);
        const comments = await commentModel.find({ postid: req.params.postid }).populate('author');
        if(comments)
            res.status(200).json(comments);
        else
            res.status(404).json({error: "post not found"});

    } catch (error) {
        res.status(400).json({error});
    }
})

router.post('/:postid/comment', isLoggedIn, async (req, res) => {
    try {

        const { comment } = req.body;
        if (!comment) {
            res.status(400).json({ error: "comment can not be empty" });
            return;
        }
        const commentModel = mongoose.model('comments', CommentSchema);
        const userModel = mongoose.model('users', UserSchema);
        const postModel = mongoose.model('posts', PostSchema);
        const unseenNotifmodel = mongoose.model("unseennotifications", unseenNotificationSchema);
        const notificationmodel = mongoose.model("notifications", notificationSchema);
        const post = await postModel.findById(req.params.postid);
        const author = await userModel.findById(req.session.login);

        const newcomment = new commentModel({
            comment,
            date: new Date(),
            author,
            postid: post
        });
        await newcomment.save();
        const newnotification = new notificationmodel({
            for_author: post.author,
            from_author: author,
            notificationtype: "comment",
            postid: post,
            date: new Date(),
        })
        await newnotification.save();
        const unseennotif = new unseenNotifmodel({
            for_author: post.author,
            notificationid: newnotification
        })
        await unseennotif.save();

        res.status(200).json({ message: "success" });


    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "something went wrong" });
    }
})


router.patch('/:postid/:id', isLoggedIn, async (req, res) => {
    try {
        const { comment: newcomment } = req.body;
        const commentModel = new mongoose.model('comments', CommentSchema);
        const commentupdate = await commentModel.findOneAndUpdate({ _id: req.params.id, author: req.session.login},{comment: newcomment}, {new: true});
        if(commentupdate)
            res.status(200).json(commentupdate);
        else
            res.status(404).json({error:"comment not found"});

    } catch (error) {
        res.status(400).json({error});
    }
})

router.delete('/:postid/:id', isLoggedIn, async (req, res) => {
    try {
        const postModel = mongoose.model('posts', PostSchema);
        const unseenNotifmodel = mongoose.model("unseennotifications", unseenNotificationSchema);
        const notificationmodel = mongoose.model("notifications", notificationSchema);
        const commentModel = mongoose.model('comments', CommentSchema);
        
        const commentstatus = await commentModel.deleteOne({ _id: req.params.id, author: req.session.login });
        const post = await postModel.findOne({_id: req.params.postid});
        const notification = await notificationmodel.findOne({from_author: req.session.login, notificationtype: "comment", postid: post});
        
        await unseenNotifmodel.deleteOne({for_author: post.author, notificationid: notification});
        await notificationmodel.deleteOne({from_author: req.session.login, notificationtype: "comment", postid: post});
        
        res.status(200).json({message: "success"})
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
})

module.exports.router = router;