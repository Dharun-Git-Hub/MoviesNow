const mongoose = require('mongoose')

const TheatreSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    location: {
        address: String,
        city: String,
        state: String,
    },
    screens: [{
        screen_number: Number,
        seating_capacity: Number,
        currently_showing: {
            movie_name: String,
            price: Number,
            showtimes: [Date],
        },
    }],
    max: { type: Number, required: true },
})

module.exports = mongoose.model('Theatre', TheatreSchema)