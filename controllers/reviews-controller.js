const { ObjectId } = require("mongodb")
const { Review } = require("../models/review")
const User = require("../models/user")

const getAllReviews = async () => {
  return await Review.find()
}
const getReviewsOfPlay = async (playId) => {
  return await Review.find({ playId: playId })
}

const getReviewsOfPlayAndUsers = async (playId) => {
  return await Review.find({ playId: playId }).populate("userId")
}

const addAReview = async (user, playId, playInstanceId, note) => {
  try {
    if (ObjectId.isValid(playId)) {
        const newReview = await new Review({
        userId: user._id,
        playId,
        playInstanceId,
        stars: note,
        })

        await newReview.save()

        await User.findByIdAndUpdate(user._id, {
        $push: { reviews: newReview._id },
        })
    }
  } catch (err) {
    throw err
  }
}

module.exports = {
  getAllReviews,
  getReviewsOfPlay,
  getReviewsOfPlayAndUsers,
  addAReview,
}
