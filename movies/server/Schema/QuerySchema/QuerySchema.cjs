const mongoose = require('mongoose')

const QuerySchema = new mongoose.Schema({
    username: { type: String, required: true },
    query: { type: String, required: true },
    resolved: Boolean,
    date: { type: Date, required: true },
    resolvedOn: Date,
})

module.exports = mongoose.model('Query',QuerySchema)