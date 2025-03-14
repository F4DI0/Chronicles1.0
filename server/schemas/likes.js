const { mongoose } = require('../utilities/connection');

const LikeSchema = new mongoose.Schema({
  postid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'posts',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
}, { timestamps: true }); // Optional: Add timestamps

// Optional: Add indexes
LikeSchema.index({ postid: 1, author: 1 }, { unique: true });

module.exports.LikeSchema = LikeSchema;