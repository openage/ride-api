'use strict'
var async = require('async')
var updateField = require('../helpers/dbQuery').updateFields
var db = require('../models/index')
var mapper = require('../mappers/service')

var serviceAlert = (data, vehicle, service, cb) => {
    var odoMeterAlert = (parseInt(data.odoMeter) + parseInt(data.nextService)) - 500 // to Give alert
    db.alerts.build({
        vehicleId: vehicle.id,
        type: service.name,
        odoMeter: odoMeterAlert,
        // smsNotify: smsNotify,
        // emailNotify: emailNotiftype: document.namey,
        status: 'open' // by default status is open
        // dailyReminder: true
    }).save().then(alert => {
        if (!alert) {
            cb('unable to create alert')
        }
        cb(null, service)
    })
}

exports.create = (req, res) => {
    var data = req.body
    var where = {}

    async.waterfall([
        (cb) => {
            if (!data.odoMeter) {
                cb('odoMeter is required')
            }
            if (!data.nextService) {
                cb('nextService is required')
            }
            if (!data.vehicleNo) {
                cb('vehicleNo is required')
            }
            where.vehicleNo = data.vehicleNo
            db.vehicle.find({
                where: where
            }).then((vehicle) => {
                if (!vehicle) {
                    cb('vehicle Not found')
                }
                cb(null, vehicle)
            })
        },
        (vehicle, cb) => {
            db.servicelLogs.build({
                vehicleId: vehicle.id,
                date: data.date,
                odoMeter: data.odoMeter,
                name: data.name,
                type: data.type,
                driver: data.driver,
                amount: data.amount,
                nextService: data.nextService
            }).save().then((newService) => {
                if (!newService) {
                    cb('could not create service')
                }
                cb(null, vehicle, newService)
            })
        },
        (vehicle, newService, cb) => {
            if (newService.name !== 'Engine Service') {
                cb(null, newService)
            }
            db.alerts.findAll({
                where: {
                    vehicleId: vehicle.id,
                    type: newService.name
                }
            }).then(alerts => {
                if (!alerts) {
                    serviceAlert(data, vehicle, newService, cb)
                }
                alerts.forEach(alert => {
                    if (alert.status !== 'closed') {
                        alert.status = 'closed'
                        alert.save()
                    }
                })
                serviceAlert(data, vehicle, newService, cb)
            })
        }
    ], (err, savedservice) => {
        if (err) {
            return res.failure(err)
        }
        return res.data(mapper.toModel(savedservice))
    })
}
// exports.get = function(req, res) {
//     db.servicelLogs.findOne({ where: { vechicleNo: req.params.id } })
//         .then(function(service) {
//             if (!service) {
//                 return res.failure('no service found');
//             }
//             return res.data(mapper.toModel(service));
//         }).catch(function(err) {
//             return res.failure(err);
//         });
// };
// exports.update = function(req, res) {
//     var data = req.body;
//     db.servicelLogs.findOne({
//         where: {
//             vehicleNo: req.params.id
//         }
//     }).then(function(service) {
//         service.date = data.date;
//         service.odoMeter = data.odoMeter;
//         service.taksDue = data.taksDue;
//         service.type = data.type;
//         service.driver = data.driver;
//         service.amount = data.amount;
//         service.save().then(function(service) {
//             res.data(mapper.toModel(service, 'updated'));
//         }).catch(function(err) {
//             return res.failure(err);
//         });
//     }).catch(function(err) {
//         return res.failure(err);
//     });
// };
exports.delete = function (req, res) {
    async.waterfall([
        function (cb) {
            db.service.findOne({ where: { vehicleNo: req.params.id } }, cb)
        },
        function (service, cb) {
            service.delete(cb)
        }
    ], function (err, service) {
        if (err) {
            return res.failure(err)
        }
        return res.success('service deleted')
    })
}
exports.search = (req, res) => {
    async.waterfall([
        cb => {
            db.vehicle.find({
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
            db.servicelLogs.findAll({
                where: {
                    vehicleId: vehicle.id
                }
            }).then((servicelLogs) => {
                if (!servicelLogs) {
                    return res.failure('no fuelLog found')
                }
                cb(null, servicelLogs)
            }).catch((err) => {
                cb(err)
            })
        }
    ], function (err, servicelLogs) {
        if (err) {
            return res.failure(err)
        }
        return res.data(mapper.toSearchModel(servicelLogs))
    })
}
