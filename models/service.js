"use strict";
var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('servicelLogs', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        vehicleNo: DataTypes.STRING,
        date: DataTypes.DATE,
        odoMeter: DataTypes.STRING,
        name: DataTypes.STRING,
        type: DataTypes.STRING,
        driver: DataTypes.STRING,
        amount: DataTypes.STRING
    });
};