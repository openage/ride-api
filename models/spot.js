'use strict'

const mongoose = require('mongoose')

module.exports = {
    location: {
        coordinates: {
            type: [Number], // [<longitude>, <latitude>]
            index: '2dsphere' // create the geospatial index
        },
        name: String,
        description: String
    },
    cost: {

    }
}
