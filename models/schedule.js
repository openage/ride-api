"use strict";
var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
    var Schedule = sequelize.define('schedule', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        vehicleNo: DataTypes.STRING,
        time: DataTypes.DATE,
        duration: DataTypes.STRING,
        destination: DataTypes.STRING,
        bookedBy: DataTypes.STRING, //TODO Foreign Key Of user
        driver: DataTypes.STRING,
        status: DataTypes.STRING,
    });
    return Schedule;
};