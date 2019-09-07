'use strict'

var mongoose = require('mongoose')

module.exports = {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'vehicle' }
    // fuelEfficiancy: DataTypes.STRING,
    // odoMeter: DataTypes.STRING,
    // tasksDue: DataTypes.STRING
}
