const { mongoose } = require('../utilities/connection');

const validatorSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true 
    },
})

module.exports.validatorSchema = validatorSchema;