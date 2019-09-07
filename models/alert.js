'use strict'

const mongoose = require('mongoose')

module.exports = {
    startDate: Date,
    odoMeter: Number,
    endDate: Date,
    emailNotify: Date,
    smsNotify: Date,
    dailyReminder: Boolean,
    type: { type: String },
    status: { type: String },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'vehicle' }
}
