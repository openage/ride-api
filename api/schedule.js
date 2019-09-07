'use strict'
var async = require('async')
var updateField = require('../helpers/dbQuery').updateFields
var db = require('../models/index')
var mapper = require('../mappers/schedule')
exports.create = function (req, res) {
    var data = req.body
    if (!data.vechicleNo) {
        res.failure('VehicleNo is required')
    }
    async.waterfall([
        cb => {
            db.vehicle.find({
                where: {
                    vehicleNo: data.vehicleNo
                }
            }).then(vehicle => {
                cb(null, vehicle)
            }).catch(cb)
        },
        (vehicle, cb) => {
            db.schedule.build({
                vehicleNo: vehicle.id,
                time: data.time,
                duration: data.duration,
                destination: data.destination,
                bookedBy: req.user.id,
                driver: data.driver,
                status: data.status
            }).save().then(newSchedule => {
                if (!newSchedule) {
                    cb('could not create schedule')
                }
                cb(null, newSchedule)
            }).catch(cb)
        }
    ], (err, savedSchedule) => {
        if (err) {
            return res.failure(err)
        }
        return res.data(mapper.toModel(savedSchedule))
    })
}
exports.get = function (req, res) {
    db.schedule.findOne({ vechicleNo: req.params.id }, function (err, schedule) {
        if (err) {
            return res.failure(err)
        }
        if (!schedule) {
            return res.failure('no schedule found')
        }
        return res.data(mapper.toModel(schedule))
    })
}
exports.update = function (req, res) {
    var data = req.body
    async.waterfall([function (cb) {
        db.schedule.findOne({ vechicleNo: req.params.id }).exec(function (err, result) {
            if (err) {
                return cb(err)
            }
            cb(null, result)
        })
    },
    function (schedule, cb) {
        schedule = entitiesHelper(summary).set(data, [
            'time',
            'duration',
            'destination',
            'bookedBy',
            'driver',
            'status'

        ])
        schedule.save(function (err, schedule) {
            if (err) {
                return cb(err)
            }
            cb(null, schedule)
        })
    }
    ], function (err, schedule) {
        if (err) {
            return cb(err)
        }
        res.data(mapper.toModel(schedule), 'updated')
    })
}
exports.delete = function (req, res) {
    async.waterfall([
        function (cb) {
            db.schedule.findOne({ vehicleNo: req.params.id }, cb)
        },
        function (schedule, cb) {
            schedule.delete(cb)
        }
    ], function (err, schedule) {
        if (err) {
            return res.failure(err)
        }
        return res.success('schedule deleted')
    })
}
exports.search = function (req, res) {
    db.schedule.findAll({
        where: {
            vechicleNo: req.query.id
        }
    })
        .then(function (schedule) {
            if (!schedule) {
                return res.failure('no schedule found')
            }
            return res.data(mapper.toSearchModel(schedule))
        }).catch(function (err) {
            return res.failure(err)
        })
}
