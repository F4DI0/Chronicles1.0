const { mongoose } = require('../utilities/connection');

const CommentSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    postid: { type: mongoose.Schema.Types.ObjectId, ref: 'posts', required: true },
    date: { type: Date, default: Date.now }
  });
// Optional: Add indexes for better performance
CommentSchema.index({ postid: 1 }); // Index for querying comments by post
CommentSchema.index({ author: 1 }); // Index for querying comments by author

module.exports.CommentSchema = CommentSchema;