'use strict'

const mongoose = require('mongoose')

module.exports = {
    date: Date,

    rate: String,
    quantity: Number, // in liters
    amount: Number, // in rs

    odoMeter: Number,
    fuelType: String, // petrol

    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'vehicle' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}
