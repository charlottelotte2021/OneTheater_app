const mongoose = require('mongoose')

const TheaterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
	address: {
        type: String,
        required: true
    },
	commune: {
        type: String
    },
	url: {
        type: String,
    }
})

const Theater = mongoose.model('Theater', TheaterSchema)

module.exports = Theater