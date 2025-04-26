const { mongoose } = require('../utilities/connection');

const notificationSchema = new mongoose.Schema({
    for_author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    from_author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    notificationtype: {
        type: String,
        enum: ['like', 'comment', 'repost', 'follow'],
        required: true
    },
    postid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    }
})

module.exports.notificationSchema = notificationSchema;