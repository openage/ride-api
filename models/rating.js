'use strict'

const mongoose = require('mongoose')

module.exports = {
    rate: { type: Number },
    title: { type: String },
    comment: { type: String },      // comment by passenger
    note: { type: String },           // comment by admin
    photos: [{ type: String }],
    status: {
        type: String,
        enum: ['submitted', 'hide', 'published', 'rejected']
    },
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'passenger' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'driver' },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'trip' },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'vehicle' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' }
}
