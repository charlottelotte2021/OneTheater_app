const mongoose = require('mongoose');
const ProfileSchema  = new mongoose.Schema({
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

const Profile = mongoose.model('Profile',ProfileSchema)

module.exports = { Profile, ProfileSchema }