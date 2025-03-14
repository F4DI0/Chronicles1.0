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

        if (!req.file) {
            res.status(400).json({ error: "can not upload empty image" });
            return;
        }

        const uploadStream = gfsBucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype,
            metadata: { author: user._id }
        });

        await uploadStream.end(req.file.buffer, () => { });
        const exists = await preferencemodel.findByIdAndUpdate({ profilepic: `file/${uploadStream.id}` });
        if (!exists) {
            res.status(400).json({ error: "account does not exist" });
            return;
        }
        console.log('profile pic updated');
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
});

router.post('/background', isLoggedIn, upload.single('file'), async (req, res) => {
    try {
        const gfsBucket = await getGfsBucketPromise;
        const preferencemodel = mongoose.model("preferences", preferenceSchema);

        if (!req.file) {
            res.status(400).json({ error: "can not upload empty image" });
            return;
        }

        const uploadStream = gfsBucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype,
            metadata: { author: user._id }
        });

        await uploadStream.end(req.file.buffer, () => { });
        const exists = await preferencemodel.findByIdAndUpdate({ background: `file/${uploadStream.id}` });
        if (!exists) {
            res.status(400).json({ error: "account does not exist" });
            return;
        }

        console.log('profile pic updated');
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
})


module.exports.router = router;

