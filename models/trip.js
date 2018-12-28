"use strict";
var bcrypt = require('bcrypt-nodejs');

module.exports = function (sequelize, DataTypes) {
    var Trip = sequelize.define('trip', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // adminId:DataTypes.INTEGER,
        code:DataTypes.STRING,
        vehicleNo: DataTypes.STRING,        
        purpose:DataTypes.STRING,
        source:DataTypes.STRING,
        destination:DataTypes.STRING,
        duration:DataTypes.STRING,        
        status: {
            type: DataTypes.ENUM,
            values: ['new','start', 'complete','cancel','approve','reject']
        },
        date:DataTypes.DATE,
        passengers:DataTypes.INTEGER,
        rejectionReason:DataTypes.STRING,
        tripMessage:DataTypes.STRING,
        vehicleType:DataTypes.STRING,
        type:DataTypes.STRING,
        model:DataTypes.STRING

    });
    return Trip;
};