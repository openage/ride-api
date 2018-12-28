"use strict";
var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        token: DataTypes.STRING,
        phone: DataTypes.INTEGER,
        name: DataTypes.STRING,
        gender: DataTypes.STRING,
        code: DataTypes.STRING,
        dob: DataTypes.DATE,
        eduUserId: DataTypes.STRING,
        isAdmin : {
            type: DataTypes.BOOLEAN,
        default :  false }

    });
};