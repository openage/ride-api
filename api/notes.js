'use strict'
var async = require('async')
var updateField = require('../helpers/dbQuery').updateFields
var db = require('../models/index')
var mapper = require('../mappers/document')
var fs = require('fs')
var path = require('path')
var fileUploader = require('../helpers/fileUploader')
var moment = require('moment')

var create = (vehicle, note, data, cb) => {
    db.documents.build({
        vehicleId: vehicle.id,
        name: data.name,
        date: data.date,
        isArchive: false,
        documentPath: data.fileUrl,
        userId: data.user.id,
        noteId: note.id,
        vehicleNo: vehicle.vehicleNo
    }).save().then(document => {
        if (!document) {
            cb('Unable to create document')
        }
        cb(null, vehicle, note, document)
    })
}

var find = (vehicle, note, cb) => {
    db.documents.findAll({
        where: {
            vehicleId: vehicle.id,
            noteId: note.id

        },
        include: [{ model: db.user }, { model: db.vehicle }, { model: db.notes }]
    }).then(document => {
        cb(null, document)
    })
}
exports.create = (req, res) => {
    var data = req.query
    data.user = req.user

    async.waterfall([
        cb => {
            if (!data.vehicleNo) {
                cb('vehileNo is required')
            }
            db.vehicle.find({
                where: {
                    vehicleNo: data.vehicleNo
                }
            }).then(vehicle => {
                if (!vehicle) {
                    cb('vehicle not found')
                }
                cb(null, vehicle)
            })
        },
        (vehicle, cb) => {
            db.notes.find({
                where: {
                    tripId: data.tripId
                },
                include: [{ model: db.user }]
            }).then(note => {
                if (!note) {
                    db.notes.build({
                        userId: data.user.id,
                        text: data.text,
                        tripId: data.tripId
                    }).save().then(note => {
                        cb(null, vehicle, note)
                    })
                } else {
                    cb(null, vehicle, note)
                }
            }).catch((err) => {
                console.log(err)
            })
        },

        (vehicle, note, cb) => {
            create(vehicle, note, data, cb)
        },
        (vehicle, note, cb) => {
            find(vehicle, note, cb)
        }
    ], (err, document) => {
        if (err) {
            return res.failure(err)
        }
        return res.data(mapper.toSearchModel(document))
    })
}
exports.search = (req, res) => {
    async.waterfall([
        cb => {
            db.vehicle.findOne({
                where: {
                    vehicleNo: req.query.vehicleNo
                }
            }).then(vehicle => {
                if (!vehicle) {
                    cb('vehicle not found')
                }
                cb(null, vehicle)
            })
        },
        (vehicle, cb) => {
            db.notes.find({
                where: {
                    tripId: req.query.tripId
                },
                include: [{ model: db.user }]
            }).then(note => {
                if (!note) {
                    cb('no trip found')
                }
                cb(null, vehicle, note)
            })
        },
        (vehicle, note, cb) => {
            find(vehicle, note, cb)
        }
    ], (err, document) => {
        if (err) {
            return res.failure(err)
        }
        return res.data(mapper.toSearchModel(document))
    })
}
