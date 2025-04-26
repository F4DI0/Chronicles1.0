const { mongoose } = require('../utilities/connection');

const pendingFormSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    date: {
        type: Date,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        enum: ['less than a year', '1-2 years', '3-5 years', '5+ years'],
        required: true
    },
    portfolio: {
        type: [String],
    },
    writingSamples: {
        type: String,
        required: true
    },
    specializedTopics: {
        type: String,
        required: true
    },
    sidenote: {
        type: String,
    },
    guidelinesAgreement: {
        type: Boolean,
        required: true
    }
});



module.exports.pendingFormSchema = pendingFormSchema;