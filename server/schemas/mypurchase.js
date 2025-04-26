const { mongoose } = require('../utilities/connection');

const mybookSchema = new mongoose.Schema({
    myitem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'purchases',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    date:{
        type: Date,
        required: true,
    },
    file: {
        type: String,
        required: true
    }
})

module.exports.mybookSchema = mybookSchema;