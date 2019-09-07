'use strict'

let mongoose = require('mongoose')

module.exports = {

    time: Date,
    ipAddress: String,
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'device' },
    location: {
        coordinates: {
            type: [Number], // [<longitude>, <latitude>]
            index: '2dsphere' // create the geospatial index
        },
        name: String,
        description: String
    },

    message: String,
    distance: Number,
    duration: Number,

    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'vehicle' }
    // driver: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    // trip: { type: mongoose.Schema.Types.ObjectId, ref: 'trip' }
}
