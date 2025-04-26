const express = require('express');
const multer = require('multer');
const { isLoggedIn } = require('../utilities/isloggedin');
const { mongoose } = require('../utilities/connection');
const { FollowSchema } = require('../schemas/follow');
const { UserSchema } = require('../schemas/user');
const { getGfsBucketPromise } = require('../utilities/gfbucket');
const { preferenceSchema } = require('../schemas/preferences');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();


router.post('/pfp', isLoggedIn, upload.single('file'), async (req, res) => {
    try {
        const gfsBucket = await getGfsBucketPromise;
        const preferencemodel = mongoose.model("preferences", preferenceSchema);
        const usermodel = mongoose.model("users", UserSchema);
        const user = await usermodel.findOne({ _id: req.session.login });

        if (!req.file) {
            res.status(400).json({ error: "can not upload empty image" });
            return;
        }

        const uploadStream = gfsBucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype,
            metadata: { author: user._id }
        });
        
        const oldpref = await preferencemodel.findOne({ author: user });
        console.log(oldpref);

        if (oldpref.profilepic != 'none')
            await gfsBucket.delete(new mongoose.Types.ObjectId(oldpref.profilepic.split('/')[1]));


        await uploadStream.end(req.file.buffer, () => { });
        await preferencemodel.findOneAndUpdate({ author: user }, { profilepic: `file/${uploadStream.id}` });
        

        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
});

router.post("/bio", isLoggedIn, async (req, res) => {
    try {
        const { bio } = req.body;
        console.log(bio);
        const preferencemodel = mongoose.model("preferences", preferenceSchema);
        const usermodel = mongoose.model("users", UserSchema);
        const user = await usermodel.findOne({ _id: req.session.login });
        await preferencemodel.findOneAndUpdate({ author: user }, { bio });
        res.status(200).json({message: "success"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    }
})

router.post('/background', isLoggedIn, upload.single('file'), async (req, res) => {
    try {
        const gfsBucket = await getGfsBucketPromise;
        const preferencemodel = mongoose.model("preferences", preferenceSchema);
        const usermodel = mongoose.model("users", UserSchema);

        if (!req.file) {
            res.status(400).json({ error: "can not upload empty image" });
            return;
        }

        const uploadStream = gfsBucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype,
            metadata: { author: user._id }
        });
        const oldpref = await preferencemodel.findOne({ author: user });
        
        if (oldpref.profilepic != 'none')
            await gfsBucket.delete(new mongoose.Types.ObjectId(oldpref.profilepic.split('/')[1]));

        
        await uploadStream.end(req.file.buffer, () => { });
        await preferencemodel.findOneAndUpdate({ author: user }, { background: `file/${uploadStream.id}` });

        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
})


module.exports.router = router;