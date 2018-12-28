"use strict";
var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('locationLogs', {
    id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tripId:DataTypes.INTEGER,
        longitude: DataTypes.STRING,
        latitude: DataTypes.STRING,
        time: DataTypes.DATE,
        locationName:DataTypes.STRING,
        locationDescription:DataTypes.STRING,
        

    });
};