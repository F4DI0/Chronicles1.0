const { mongoose } = require('../utilities/connection');

const postseen = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    postid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        required: true,
    }
})

module.exports.postseenSchema = postseen;