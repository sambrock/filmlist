const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

const watchlistSchema = new Schema({
  movieId: {
    type: Number,
    required: true
  }
});

const seenSchema = new Schema({
  movieId: {
    type: Number,
    required: true
  },
  like: Boolean,
  rating: Number
});

const notInterestedSchema = new Schema({
  movieId: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    expires: 60*60*24*7*4, // 1 month
    default: Date.now
  }
});

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  watchlist: [watchlistSchema],
  seen: [seenSchema],
  notInterested: [notInterestedSchema]
});

userSchema.methods.generateHash = async function (password) {
  return bcrypt.hash(password, await bcrypt.genSalt(8));
};

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this.id, username: this.username }, jwtPrivateKey);
  return token;
};

module.exports = mongoose.model('user', userSchema);
