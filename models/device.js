'use strict'

const mongoose = require('mongoose')

module.exports = {
    key: String,
    type: { type: String }, // phone, GPS
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'vehicle' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'driver' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' }
}
