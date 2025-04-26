const express = require('express');
const { mongoose } = require('../utilities/connection');
const { UserSchema } = require('../schemas/user');
const { PostSchema } = require('../schemas/post');
const { isLoggedIn } = require('../utilities/isloggedin');
const router = express.Router();


router.get('/', isLoggedIn, async (req, res) => {
    try {
        const usermodel = mongoose.model('users', UserSchema);
        const postmodel = mongoose.model('posts', PostSchema);
        const { q, type } = req.query;
        const modifiedq = ".*" + q + ".*"

        if (q === "" || q === undefined)
            return res.status(404).json({ results: [] });

        switch (type) {
            case "people":
                const arrofusers = await usermodel.find({
                    username: { $regex: modifiedq, $options: 'i' }
                }).select("username isWriter email");
                return res.status(200).json({result: arrofusers});
                break;
            case "posts":
                const arrofposts = await postmodel.find({
                    title: { $regex: modifiedq, $options: 'i' }
                }).populate("author", "username email")
                return res.status(200).json({result: arrofposts});
                break;
        }

        res.status(400).json({ error: "error" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "something went wrong" });
    }
});


module.exports.router = router;
