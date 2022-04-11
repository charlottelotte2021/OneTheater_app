const User = require("../models/user")
const cloudinary = require('cloudinary').v2


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


// Cloudinary
const uploadProfilePic = async (image) => {
    try {
        const result = await cloudinary.uploader.upload(image, { resource_type: 'image' })
        // console.log('success', JSON.stringify(result, null, 2))
        return result.url
    }
    catch (err) {
        console.log('error', JSON.stringify(err, null, 2))
    }
}



module.exports = {
    getUserAndReviews,
    getUserAndWishlist,
    getUserAndWishlistPopulated,
    getUserWishlistAndReviews,
    getUserWishlistAndReviewsPopulated,
    uploadProfilePic
}