const express = require('express');
const { isLoggedIn } = require('../utilities/isloggedin');
const { mongoose } = require('../utilities/connection');
const router = express.Router();
const { getGfsBucketPromise } = require('../utilities/gfbucket');


// tested 3/7/2025
// reading single file
router.get('/file/:fileId', isLoggedIn, async (req, res) => {
    const gfsBucket = await getGfsBucketPromise;
    const fileId = req.params.fileId;
    try {
        // Convert the fileId string to an ObjectId
        const objectId = new mongoose.mongo.ObjectId(fileId);

        // Find the file metadata by ID
        const file = await gfsBucket.find({ _id: objectId }).toArray();

        if (!file || file.length === 0) {
            console.log('File not found for ID:', fileId);
            return res.status(404).json({ message: 'File not found' });
        }

        // Stream the file to the client
        const downloadStream = gfsBucket.openDownloadStream(objectId);
        downloadStream.on('error', (err) => {
            console.error('Error streaming file:', err);
            res.status(500).json({ error: 'Error streaming file' });
        });
        downloadStream.pipe(res);
    } catch (err) {
        console.error('Error finding file:', err);
        res.status(400).json({ message: 'Invalid file ID' });
    }
});

//fix this shit
router.delete('/file/:fileId', isLoggedIn, async (req, res) => {
    const fileId = req.params.fileId;
    const userid = new mongoose.mongo.ObjectId(req.session.login);
    const gfsBucket = await getGfsBucketPromise;
    try {
        // Convert the fileId string to an ObjectId
        const objectId = new mongoose.mongo.ObjectId(fileId);

        // Find the file metadata by ID
        const file = await gfsBucket.find({ _id: objectId, 'metadata.author': userid}).toArray();

        if (!file || file.length === 0) {
            console.log('File not found for ID:', fileId);
            return res.status(404).json({ message: 'File not found' });
        }

        // Delete the file from GridFS
        await gfsBucket.delete(objectId);
        console.log('File deleted successfully. File ID:', fileId);
        res.status(200).json({ message: 'File deleted successfully', fileId });
    } catch (err) {
        console.error('Error deleting file:', err);
        res.status(400).json({ message: 'Invalid file ID or deletion failed' });
    }
});





module.exports.router = router;