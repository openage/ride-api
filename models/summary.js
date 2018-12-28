"use strict";
var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
    var Summary = sequelize.define('summary', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        vehicleNo:DataTypes.STRING,
        fuelEfficiancy: DataTypes.STRING,
        odoMeter: DataTypes.STRING,
        tasksDue:DataTypes.STRING
    });
    return Summary;
};