'use strict'

var mongoose = require('mongoose')

module.exports = {
    from: Date, // time
    till: Date,

    startTime: Date, // the actual time when the trip started
    endTime: Date, // the actual time when the trip ended

    type: { type: String }, // trip type: personal, official

    purpose: String,
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'route' }, // only in case of planned routes
    origin: {
        coordinates: {
            type: [Number], // [<longitude>, <latitude>]
            index: '2dsphere' // create the geospatial index
        },
        name: String,
        description: String
    },
    destination: {
        coordinates: {
            type: [Number], // [<longitude>, <latitude>]
            index: '2dsphere' // create the geospatial index
        },
        name: String,
        description: String
    },
    wayPoints: [{
        spot: { type: mongoose.Schema.Types.ObjectId, ref: 'spot' },
        passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
        eta: Date,
        ata: Date
    }],

    locationLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'locationLog' }],
    duration: Number, // in minutes
    status: {
        type: String,
        enum: ['new', 'canceled', 'rejected', 'approved', 'active', 'started', 'completed']
    },
    date: Date, // todo remove
    notes: [{
        text: String,
        date: Date
    }], // reason, notes etc

    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'vehicle' },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'passenger' }],
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'driver' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' }
}
