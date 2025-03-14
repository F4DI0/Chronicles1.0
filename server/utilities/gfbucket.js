const { mongoose } = require("./connection");
const conn = mongoose.connection;

let gfsBucket;

const getGfsBucketPromise = new Promise((resolve, reject) => {
    conn.once('open', () => {
        gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: 'uploads',
        });
        resolve(gfsBucket);
    });

    conn.on('error', (err) => {
        reject(err);
    });
});

module.exports.getGfsBucketPromise = getGfsBucketPromise;