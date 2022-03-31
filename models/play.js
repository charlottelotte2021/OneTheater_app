const mongoose = require('mongoose')

const PlaySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
	genre: {
        type: String,
    },
	director: {
        type: String
    },
	production: {
        type: String,
    },
	public: {
        type: String,
    },
	duration: {
        type: String,
    },
	playsInstances: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PlayInstance"
        }
	]
})

const Play = mongoose.model('Play', PlaySchema)

module.exports = Play