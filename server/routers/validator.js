const express = require('express');
const multer = require('multer');
const { mongoose } = require('../utilities/connection');
const { isLoggedIn } = require('../utilities/isloggedin');
const { getGfsBucketPromise } = require('../utilities/gfbucket');
const { UserSchema } = require('../schemas/user');
const { pendingFormSchema } = require('../schemas/pendingforms');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();
router.use(express.urlencoded({ extended: true }))


//http://localhost:3000/validation/postform

router.post("/postform", isLoggedIn, upload.single('writingSamples'), async (req, res) => {
    try {
        const { fullName, email, phoneNumber, location, experience, portfolio, topics, motivation, guidelinesAgreement } = req.body;

        if (!req.file) {
            res.status(400).json({ error: "no sample has been provided" });
            return;
        }

        if (!fullName || !email || !phoneNumber || !location || !experience || !topics || !guidelinesAgreement) {
            res.status(400).json({ error: "data is incomplete" });
            return;
        }
        const usermodel = mongoose.model('users', UserSchema);
        const pendingformmodel = mongoose.model("pendingforms", pendingFormSchema);
        console.log(experience);
        const user = await usermodel.findById(req.session.login);
        const issubbmitted = await pendingformmodel.findOne({ author: user });
        if (issubbmitted) {
            res.status(400).json({ error: "a form already submitted before by you" });
            return;
        }

        const gfsBucket = await getGfsBucketPromise;
        const uploadStream = await gfsBucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype,
            metadata: { author: user._id }
        });
        await uploadStream.end(req.file.buffer, () => { });
        url = `file/${uploadStream.id}`;
        const newform = new pendingformmodel({
            author: user,
            date: new Date(),
            email,
            full_name: fullName,
            experience: experience.toLowerCase(),
            guidelinesAgreement,
            writingSamples: url,
            sidenote: motivation,
            portfolio,
            phoneNumber,
            specializedTopics: topics,
            location
        })
        await newform.save();
        res.status(200).json({ message: "success" })
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "something went wrong" })
    }

})
// http://localhost:3000/validation/status
router.get("/status", isLoggedIn, async (req, res) => {
    try {
        const usermodel = mongoose.model('users', UserSchema);
        const pendingformmodel = mongoose.model("pendingforms", pendingFormSchema);
        const user = await usermodel.findById(req.session.login);
        const issubmitted = await pendingformmodel.findOne({ author: user });
        if (user.isWriter) {
            res.status(200).json({ issubmitted: true, accepted: true })
        }
        else if (issubmitted) {
            res.status(200).json({ issubmitted: true, accepted: false })
        }
        else
            res.status(200).json({ issubmitted: false })

    } catch (error) {
        console.log(error)
        res.status(400).json({ error: "something went wrong" })
    }
})

router.get("/allpendingforms", isLoggedIn, async (req, res) => {
    try {
      const pendingformmodel = mongoose.model("pendingforms", pendingFormSchema);
      const pendingForms = await pendingformmodel.find().populate('author', 'username email'); // optional: populate author info
      res.status(200).json(pendingForms);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch pending forms" });
    }
  });
  
  // Approve (make the user a writer)
router.patch("/approve/:formId", isLoggedIn, async (req, res) => {
    try {
        const pendingformmodel = mongoose.model("pendingforms", pendingFormSchema);
        const usermodel = mongoose.model("users", UserSchema);

        const form = await pendingformmodel.findById(req.params.formId).populate('author');

        if (!form) {
            return res.status(404).json({ error: "Form not found" });
        }

        const userId = form.author._id;
        await usermodel.findByIdAndUpdate(userId, { isWriter: true });

        await pendingformmodel.findByIdAndDelete(req.params.formId);

        res.status(200).json({ message: "User promoted to writer successfully!" });
    } catch (error) {
        console.error("Error approving form:", error);
        res.status(500).json({ error: "Failed to approve user" });
    }
});

// Decline (remove the pending form)
router.delete("/decline/:formId", isLoggedIn, async (req, res) => {
    try {
        const pendingformmodel = mongoose.model("pendingforms", pendingFormSchema);

        const form = await pendingformmodel.findById(req.params.formId);

        if (!form) {
            return res.status(404).json({ error: "Form not found" });
        }

        await pendingformmodel.findByIdAndDelete(req.params.formId);

        res.status(200).json({ message: "Form declined and deleted successfully" });
    } catch (error) {
        console.error("Error declining form:", error);
        res.status(500).json({ error: "Failed to decline form" });
    }
});

router.get('/view/:id', isLoggedIn, async (req, res) => {
    try {
      const gfsBucket = await getGfsBucketPromise;
      const fileId = new mongoose.Types.ObjectId(req.params.id);
      
      const file = await gfsBucket.find({ _id: fileId }).toArray();
  
      if (!file || file.length === 0) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      res.set('Content-Type', file[0].contentType);
      const downloadStream = gfsBucket.openDownloadStream(fileId);
  
      downloadStream.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch file" });
    }
  });
  


module.exports.router = router;