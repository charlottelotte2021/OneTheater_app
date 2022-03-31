const mongoose = require('mongoose')

const PlayInstanceSchema = new mongoose.Schema({
    theaterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theater"
    },
    // dateStart: {
    //     type: Date,
    //     required: true
    // },
    // dateEnd: {
    //     type: Date,
    // },
    date: {
        type: String,
        // required: true
    },
    image: {
        type: String,
    },
    summary: {
        type: String,
        // required: true
    },
    time: {
        type: String,
    },
    price: {
        type: String
    },
    bookingUrl: {
        type: String,
    }
})

const PlayInstance = mongoose.model('PlayInstance', PlayInstanceSchema)

module.exports = PlayInstance