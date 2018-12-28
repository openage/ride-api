"use strict";
var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('fuelLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        vehicleNo: DataTypes.STRING,
        date: DataTypes.DATE,
        odoMeter: DataTypes.STRING,
        fuel: DataTypes.STRING, //todo delete not required
        fuelType: DataTypes.STRING,
        rate: DataTypes.STRING,
        quantity: DataTypes.STRING,
        driver: DataTypes.STRING,
        amount: DataTypes.STRING
    });
};