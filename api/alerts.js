'use strict';
var async = require('async');
var moment = require('moment');
var updateField = require('../helpers/dbQuery').updateFields;
var auth = require('../middleware/authorization');
var db = require('../models/index');
var mapper = require('../mappers/alert');

exports.create = (req, res) => {
    var data = req.body;
    var smsNotify, emailNotify, endDate;
    var where = {};
    if (!data.vehicleNo) {
        return res.failure('vehileNo is required');
    }
    data.status = 'active';
    endDate = moment(data.endDate).format('L');
    where.vehicleNo = data.vehicleNo;
    // ToDo Status : Archive , Snooze, Active
    if (data.isEnableSms && data.smsDays) {
        smsNotify = moment(endDate).subtract(data.smsDays, 'days');
        smsNotify = moment(smsNotify._d).format('L');
    }
    if (data.isEnableEmail && data.emailDays) {
        emailNotify = moment(endDate).subtract(data.emailDays, 'days');
        emailNotify = moment(emailNotify._d).format('L');
    }
    async.waterfall([
        cb => {
            db.vehicle.findOne({
                where: where
            }).then((vehicle) => {
                if (!vehicle) {
                    cb('vehicle not found');
                }
                cb(null, vehicle);
            }).catch((err) => {
                return cb(err);
            });
        },
        (vehicle, cb) => {
            db.alerts.build({
                endDate: endDate,
                emailNotify: emailNotify,
                smsNotify: smsNotify,
                dailyReminder: data.dailyReminder,
                type: data.type,
                status: data.status,
                vehicleId: vehicle.id
            }).save().then((alert) => {
                if (!alert) {
                    cb("could not create alert");
                }
                cb(null, alert);
            }).catch(cb);
        }
    ], (err, savedAlert) => {
        if (err) {
            return res.failure(err);
        }
        return res.data(mapper.toModel(savedAlert));
    });
};

exports.get = function(req, res) {
    db.alerts.findOne({
        where: {
            id: req.params.id,
        }
    }, function(err, alert) {
        if (err) {
            return res.failure(err);
        }
        if (!alert) {
            return res.failure('no alert found');
        }
        return res.data(mapper.toModel(alert));
    });
};

exports.update = function(req, res) {
    var data = req.body;
    db.alerts.findOne({
        where: {
            id: req.params.id ? data.id : 0
        }
    }).then(function(alert) {
        alert.vehicleNo = data.vehicleNo;
        alert.startDate = data.startDate;
        alert.endDate = data.endDate;
        alert.status = data.status;
        alert.save().then(function(alert) {
            res.data(mapper.toModel(alert), 'updated');
        }).catch(function(err) {
            res.failure(err);
        });
    }).catch(function(err) {
        res.failure(err);

    });
};

exports.delete = function(req, res) {
    async.waterfall([
        function(cb) {
            db.alert.findOne({ vehicleNo: req.params.id }, cb);
        },
        function(alert, cb) {
            alert.delete(cb);
        }
    ], function(err, alert) {
        if (err) {
            return res.failure(err);
        }
        return res.success('alert deleted');
    });
};
exports.search = function(req, res) {
    var modifiedAlerts = [];
    if (req.query.vehicleNo) {
        db.vehicle.find({
            where: {
                vehicleNo: { $like: '%' + req.query.vehicleNo + '%' }
            }
        }).then(vehicle => {
            if (!vehicle) {
                return res.failure('vehicle not found');
            }
            db.alerts.findAll({
                where: {
                    vehicleId: vehicle.id
                },
                include: [{ model: db.vehicle }]
            }).then(function(alerts) {
                if (!alerts) {
                    return res.failure('no alert found');

                }
                alerts.forEach(alert => {
                    if (alert.endDate) {
                        var endDate = moment(alert.endDate);
                        var differ = endDate.diff(moment(), 'days');
                        if (differ <= 10) { // todo && differ>=0 if requird
                            modifiedAlerts.push(alert);
                        }
                    }
                    if (alert.odoMeter) {
                        if (vehicle.odoMeter >= alert.odoMeter) {
                            modifiedAlerts.push(alert);
                        }
                    }
                });
                return res.data(mapper.toSearchModel(modifiedAlerts));
            });
        });
    } else {
        db.alerts.findAll({
            include: [{ model: db.vehicle }]
        }).then(function(alerts) {
            if (!alerts) {
                return res.failure('no alert found');
            }
            return res.data(mapper.toSearchModel(alerts));
        }).catch(function(err) {
            return res.failure(err);
        });
    }

};