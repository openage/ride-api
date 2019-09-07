'use strict'
var fs = require('fs')
var join = require('path').join
var mongoose = require('mongoose')
var dbConfig = require('config').get('dbServer')
const logger = require('@open-age/logger')('settings.database')

module.exports.configure = function (app) {
    mongoose.Promise = global.Promise

    var connect = function () {
        console.log('connecting to', dbConfig)
        mongoose.connect(dbConfig.host)
    }

    connect()

    var db = mongoose.connection

    db.on('connected', function () {
        console.log('DB Connected')
    })

    db.on('error', function (err) {
        logger.error('Mongoose default connection error: ' + err)
    })

    db.on('disconnected', function () {
        console.log('Again going to connect DB')
        connect()
    })

    global.db = require('../models')
    return global.db
}
