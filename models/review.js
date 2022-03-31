const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
	profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
	playId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Play"
    },
	stars: {
        type: Number,
        required: true
    },
	comment: {
        type: String
    },
	dateSeen: {
        type: Date
    },
    placeSeen: { // not theaterId in case the user saw it somewhere that's not listed
        type: String
    },
	createdAt: {
        type: Date,
        default: Date.now
    }
})

const Review = mongoose.model('Review', ReviewSchema)

module.exports = Review