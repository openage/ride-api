'use strict'

const mongoose = require('mongoose')

module.exports = {
    name: String, 
    code: String,
    shortName: String,
    type: String,
    address: {
        line1: String,
        line2: String,
        district: String,
        city: String,
        state: String,
        pinCode: String,
        country: String
    },

    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'driver' }
}
