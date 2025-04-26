const { mongoose } = require('../utilities/connection');

const purchaseSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stores',
        required: true,
    }
})

module.exports.purchaseSchema = purchaseSchema;