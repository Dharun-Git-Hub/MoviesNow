const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    language: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    poster_url: { type: String, required: true },
    trailer_url: String,
})

module.exports = mongoose.model('Movie',MovieSchema)