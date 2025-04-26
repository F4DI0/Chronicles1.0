const { mongoose } = require('../utilities/connection');

const adminusersSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true 
    },
})

module.exports.adminusersSchema = adminusersSchema;