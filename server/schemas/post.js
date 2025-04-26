const { mongoose } = require('../utilities/connection')

const PostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },
    date: {
        type: Date,
        required: true
    },
    fileurl: {
        type: String
    },
    filetype: {
        type: String,
    },
    posttype: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    repost: {
        type: Boolean,
        required: true,
        default: false
    },
    repostid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
    }
})

module.exports.PostSchema = PostSchema;