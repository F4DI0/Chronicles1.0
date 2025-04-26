const { mongoose } = require('../utilities/connection')

const viewsSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    count: {
        type: Number,
        default: 0,
        required: true,
    }

}, { versionKey: false })


module.exports.viewsSchema = viewsSchema;