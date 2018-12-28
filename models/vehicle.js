"use strict";
var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('vehicle', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        vehicleNo: DataTypes.STRING,
        type: DataTypes.STRING,
        capacity: DataTypes.INTEGER,
        picUrl: DataTypes.STRING,
        driver: DataTypes.STRING,
        odoMeter: DataTypes.INTEGER,
        fuelEfficiency: DataTypes.INTEGER,
        availability: {
            type: DataTypes.ENUM,
            values: ['available', 'busy']
        }
    }, {
        classMethods: {
            AVAILABILITY: {
                AVAILABLE: 'available',
                BUSY: 'busy'
            }
        }
    });
};