const User = require("../models/user")

const getUserAndWishlist = async (user) => {
    return await User.findById(user._id).populate('wishlist')
}

const getUserAndReviews = async (user) => {
    return await User.findById(user._id).populate('reviews')
}

const getUserWishlistAndReviews = async (user) => {
    return await User.findById(user._id).populate([ 'wishlist', 'reviews' ])
}

module.exports = {
    getUserAndReviews,
    getUserAndWishlist,
    getUserWishlistAndReviews
}