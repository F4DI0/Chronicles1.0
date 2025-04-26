const { mongoose } = require('../utilities/connection');

const preferenceSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Refers to the User model
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
    bio: {
        type: String,
    },
    tags: {
        type: [String],
    },
    bannedtags: {
        type: [String],
    }
});

module.exports.preferenceSchema = preferenceSchema;
