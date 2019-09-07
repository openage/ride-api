'use strict'

const mongoose = require('mongoose')

module.exports = {
    name: String,
    source: {
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
    spots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'spot' }]

}
