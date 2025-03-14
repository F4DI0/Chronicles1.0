const { mongoose } = require('../utilities/connection');
const { getGfsBucketPromise } = require('../utilities/gfbucket');
const bcrypt = require('bcrypt');
const express = require('express');
const { UserSchema } = require('../schemas/user');
const { PostSchema } = require('../schemas/post');
const { CommentSchema } = require('../schemas/comments');
const { preferenceSchema } = require('../schemas/preferences');
const { isLoggedIn } = require('../utilities/isloggedin')
const router = express.Router();
router.use(express.urlencoded({ extended: true }))



//account creation tested 3/3/2025 success
router.post('/create', async (req, res) => {
    try {
        const { firstname, lastname, username, email, password, rpassword } = req.body;
        const usermodel = mongoose.model('users', UserSchema);
        const preferencemodel = mongoose.model('preferences', preferenceSchema);
        

        if (!firstname) {
            res.status(400).json({ error: "first name can not be empty" });
            return;
        }
        if (!lastname) {
            res.status(400).json({ error: "last name can not be empty" });
            return;
        }
        if (password != rpassword) {
            res.status(400).json({ error: "passwords don't match" });
            return;
        }

        //check password's pattern todo
        const stat = await usermodel.findOne({ email: email });
        if (stat) {
            res.status(400).json({ error: "email is already in use" });
            return;
        }
        const salt = await bcrypt.genSalt(12);
        const hashedpassword = await bcrypt.hash(password, salt);


        const user = new usermodel({
            firstname,
            lastname,
            username,
            email,
            password: hashedpassword,
            isWriter: false
        })
        const preferenceuser = new preferencemodel({
            author: user,
            background: "none",
            profilepic: "none",
        });
        await preferenceuser.save();
        await user.save();
        req.session.login = user._id;

        res.status(200).json({ message: 'success' });

    } catch (error) {
        console.log("error");
        console.log(error);
        res.status(400).json({ error: error });
    }
});

//account deletion tested 3/6/2025 success
router.delete('/deleteaccount', isLoggedIn, async (req, res) => {
    try {
        const gfsBucket = await getGfsBucketPromise;
        const usermodel = mongoose.model('users', UserSchema);
        const postmodel = mongoose.model('posts', PostSchema);
        const preferencemodel = mongoose.model('preferences', preferenceSchema);
        const commentmodel = mongoose.model('comments', CommentSchema);
        const user = await usermodel.findOne({ _id: req.session.login });
        const allposts = await postmodel.find({ author: user });
        for (let post of allposts) {
            if (post.fileurl) {
                const id = post.fileurl.split('/')[1];
                gfsBucket.delete(new mongoose.Types.ObjectId(id));
            }
        }
        const deletedposts = await postmodel.deleteMany({ author: user });
        const deletedcomments = await commentmodel.deleteMany({ author: user });
        const deleteduser = await usermodel.deleteOne({ _id: req.session.login });
        const deletedPreference = await preferencemodel.deleteOne({author: user});
        req.session.destroy();
        if (deleteduser)
            res.status(200).json({ message: 'success' });
        else
            res.status(400).json({ error: "account not found" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
})

// http://localhost:3000/users/login
// login tested successfully 3/3/2025
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const usermodel = mongoose.model('users', UserSchema);
        const user = await usermodel.findOne({ email: email });
        if (!user) {
            res.status(401).json({ error: 'invalid email/password' });
            return;
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.status(401).json({ error: 'invalid email/password' });
            return;
        }
        req.session.login = user._id;
        res.status(200).json({ message: 'success' });
        console.log("logged in");
    } catch (error) {
        res.status(400).json({ error });
    }
})

//doesn't need testing 3/3/2025
router.get('/logout', isLoggedIn, async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/testing')

    } catch (error) {
        res.status(400).json({ error });
    }
})


module.exports.router = router;