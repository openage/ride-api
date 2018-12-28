"use strict";
var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('alerts', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        vehicleNo: DataTypes.STRING,
        startDate: DataTypes.DATE,
        odoMeter: DataTypes.INTEGER,
        endDate: DataTypes.DATE,
        emailNotify: DataTypes.DATE,
        smsNotify: DataTypes.DATE,
        dailyReminder: DataTypes.BOOLEAN,
        type: DataTypes.STRING,
        status: DataTypes.STRING
    });
};