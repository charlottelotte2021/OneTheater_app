const { Review } = require("../models/review")

const getAllReviews = async () => {
    return await Review.find()
}
const getReviewsOfPlay = async (playId) => {
    return await Review.find({ playId: playId })
}

const getReviewsOfPlayAndUsers = async (playId) => {
    return await Review.find({ playId: playId }).populate('userId')
}

module.exports = {
    getAllReviews,
    getReviewsOfPlay,
    getReviewsOfPlayAndUsers
}