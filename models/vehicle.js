'use strict'

const mongoose = require('mongoose')

module.exports = {
    type: { type: String }, // bus, car, bike
    model: String, // SAFARI
    maker: String, // valvo, maruti, TATA
    capacity: Number,
    odoMeter: Number,
    purpose: String, // ambulance,
    category: String, // ambulance types

    vehicleNo: String,
    pic: {
        url: String,
        data: String
    },

    about: String,
    proof: {
        type: { type: String },
        picUrl: { type: String }
    },

    fuelType: String,
    fuelEfficiency: String,
    status: {
        type: String,
        enum: ['available', 'booked', 'hide'],
        default: 'available'
    },
    isPublic: Boolean,

    location: {
        coordinates: {
            type: [Number], // [<longitude>, <latitude>]
            index: '2dsphere' // create the geospatial index
        },
        name: String,
        description: String
    },

    facilities: [{
        type: String
    }],

    rating: {
        rate: { type: Number, default: 0 },
        rateCount: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        oneStar: { type: Number, default: 0 },
        twoStar: { type: Number, default: 0 },
        threeStar: { type: Number, default: 0 },
        fourStar: { type: Number, default: 0 },
        fiveStar: { type: Number, default: 0 }
    },

    currentTrip: { type: mongoose.Schema.Types.ObjectId, ref: 'trip' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'driver' },
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'device' },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'driver' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' }
}
