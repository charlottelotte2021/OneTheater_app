const mongoose = require('mongoose')

const UserSchema  = new mongoose.Schema({
  username: {
      type: String,
      required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  picture: {
    type: String
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wishlist"
    }
  ]
})

const User= mongoose.model('User', UserSchema)

module.exports = User
