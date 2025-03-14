const { mongoose } = require('../utilities/connection');

const preferenceSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    profilepic: {
        type: String,
        required: true,
    },
    background: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
    },
    bannedtags: {
        type: [String],
    }
})

module.exports.preferenceSchema = preferenceSchema;