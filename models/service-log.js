'use strict'

const mongoose = require('mongoose')

module.exports = {
    date: Date,
    odoMeter: Number,
    amount: String,
    // name: DataTypes.STRING,  //todo remove
    type: String, // oil change, break service, engine service
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, // shortOut driver and user
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'vehicle' },
    data: String // service station details
}
