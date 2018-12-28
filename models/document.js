"use strict";
var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('documents', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // visible: DataTypes.BOOLEAN,
        isArchive: DataTypes.BOOLEAN,
        vehicleNo: DataTypes.STRING,
        date: DataTypes.DATE,
        name: DataTypes.STRING,
        documentPath: DataTypes.STRING, 
    });
};