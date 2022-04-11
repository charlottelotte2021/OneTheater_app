const User = require("../models/user")

const getUserAndWishlist = async (user) => {
    return await User.findById(user._id).populate('wishlist')
}

const getUserAndWishlistPopulated = async (user) => {
    return await User.findById(user._id).populate({ path: 'wishlist', populate: { path: 'playInstanceId' } })
}

const getUserAndReviews = async (user) => {
    return await User.findById(user._id).populate('reviews')
}

const getUserWishlistAndReviews = async (user) => {
    return await User.findById(user._id).populate([ 'wishlist', 'reviews' ])
}

const getUserWishlistAndReviewsPopulated = async (user) => {
    return await User.findById(user._id).populate([ 'wishlist', { path: 'reviews', populate: { path: 'playId' }} ])
}

module.exports = {
    getUserAndReviews,
    getUserAndWishlist,
    getUserAndWishlistPopulated,
    getUserWishlistAndReviews,
    getUserWishlistAndReviewsPopulated
}