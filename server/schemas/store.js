const { mongoose } = require('../utilities/connection');

const { Schema } = mongoose;

const storeSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    uploader: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    description: {
        type: String, 
        required: true
    },
    uploaddate: {
        type: Date,
        required: true
    },
    fileurl: {
        type: String,
        required: true
    },
    bookcoverurl: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    genre: {
        type: String,
        required: true
    },
    filetype: {
        type: String,
        enum: ['segment', 'fullbook'],
    },
    pages: {
        type: Number,
        required: true
    },
    super: {
        type: Schema.Types.ObjectId,
        ref: 'stores',
    }
});

module.exports.storeSchema = storeSchema;