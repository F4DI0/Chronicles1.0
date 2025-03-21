const express = require('express');
const { mongoose } = require('../utilities/connection');
const { isLoggedIn } = require('../utilities/isloggedin');
const { PostSchema } = require('../schemas/post');
const { UserSchema } = require('../schemas/user');
const { CommentSchema } = require('../schemas/comments');
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

        const {comment} = req.body;
        if(!comment){
            res.status(400).json({error: "comment can not be empty"});
            return;
        }
        const commentModel = mongoose.model('comments', CommentSchema);
        const userModel = mongoose.model('users', UserSchema);
        const postModel =  mongoose.model('posts', PostSchema);
        const post = await postModel.findById(req.params.postid);
        const author = await userModel.findById(req.session.login);

        const newcomment = new commentModel({
            comment,
            date: new Date(),
            author,
            postid: post
        });
        const status = await newcomment.save();
        if(status)
            res.status(200).json({message:"success"});
        else
            res.status(400).json({error: "something went wrong"});
    } catch (error) {
        console.log(error);
        res.status(400).json({error});
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
        const commentModel = new mongoose.model('comments', CommentSchema);
        const commentstatus = await commentModel.deleteOne({ _id: req.params.id, author:req.session.login});
        if(commentstatus.deletedCount > 0)
            res.status(200).json({message:"success"});
        else
            res.status(404).json({error:"comment not found"});

    } catch (error) {
        res.status(400).json({error});
    }
})

module.exports.router = router;