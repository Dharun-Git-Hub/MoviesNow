const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    theatre: { type: String, required: true },
    movie: { type: String, required: true },
    screen: Number,
    ticketPrice: Number,
    no: Number,
    seats: [Number],
    payable: Number,
    showTime: { type: Date, required: true },
    bookedDate: Date,
})

module.exports = mongoose.model('Ticket',TicketSchema)