const { mongoose } = require('../utilities/connection');

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isWriter: {
    type: Boolean,
    default: false,
  },

  preferences: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Preferences',
    required: false, //needs fixes
  }
}, { versionKey: false });


module.exports.UserSchema = UserSchema;