const { mongoose } = require('../utilities/connection');

const FollowSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    follows: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    }
})

module.exports.FollowSchema = FollowSchema;