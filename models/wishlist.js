const mongoose = require('mongoose')

const WishlistSchema = new mongoose.Schema({
    playInstanceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlayInstance"
    }
})

const Wishlist = mongoose.model('Wishlist', WishlistSchema)

module.exports = { Wishlist, WishlistSchema }