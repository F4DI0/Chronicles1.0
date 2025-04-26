const { mongoose } = require('../utilities/connection');

const unseenNotificationSchema = new mongoose.Schema({
    for_author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    notificationid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notifications',
        required: true
    }
})

module.exports.unseenNotificationSchema = unseenNotificationSchema;