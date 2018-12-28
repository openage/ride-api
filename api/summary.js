'use strict';
var async = require('async');
var updateField = require('../helpers/dbQuery').updateFields;
var auth = require('../middleware/authorization');
var db = require('../models/index');
var mapper = require('../mappers/summary');

exports.create = function (req, res) {
    var data = req.body;
    async.waterfall([
        function (cb) {
            var where = {};
            if (data.vehicleNo) {
                where.vehicleNo = data.vehicleNo;
            } else {
                res.failure('vehicleNo is required');
            }
            db.vehicle.find({
                where: where
            }).then(function (vehicle) {
                cb(null, vehicle);
            }).catch(cb);
        },
        function (vehicle, cb) {
            if (!vehicle) {
                return res.failure('vehicle not  found');
            }

            db.summary.build({
                vehicleNo: data.vehicleNo,
                fuelEfficiancy: data.fuelEfficiancy,
                odoMeter: data.odoMeter,
                taksDue: data.taksDue
            }).save().then(function (newSummary) {
                if (!newSummary) {
                    return cb("could not create Summary");
                }
                cb(null, newSummary);
            }).catch(function (err) {
                return cb(err);
            });
        },
        function (summary, cb) {
            summary.save()
                .then(function (savedSummary) {
                    cb(null, savedSummary);
                }).catch(function (err) {
                    return cb(err);
                });
        }
    ], function (err, savedSummary) {
        if (err) {
            return res.failure(err);
        }
        return res.data(mapper.toModel(savedSummary));
    });
};
exports.get = function (req, res) {
    db.summary.findOne({
        where: {
            vehicleNo: req.params.id
        }
    })
        .then(function (summary) {

            if (!summary) {
                return res.failure('no summary found');
            }
            return res.data(mapper.toModel(summary));
        }).catch(function (err) {
            return res.failure(err);

        });
};
exports.update = function (req, res) {
    var data = req.body;
    db.summary.findOne({
        where: {
            vehicleNo: req.params.id
        }
    })
        .then(function (summary) {
            summary.fuelEfficiancy = data.fuelEfficiancy;
            summary.odoMeter = data.odoMeter;
            summary.taksDue = data.taksDue;
            summary.save().then(function (summary) {
                return res.data(mapper.toModel(summary), 'updated');

            }).catch(function (err) {
                return res.failure(err);

            });
        }).catch(function (err) {
            return res.failure(err);
        });

};
exports.delete = function (req, res) {
    async.waterfall([
        function (cb) {
            db.summary.findOne({ vehicleNo: req.params.id }, cb);
        },
        function (summary, cb) {
            summary.delete(cb);
        }
    ], function (err, summary) {
        if (err) {
            return res.failure(err);
        }
        return res.success('summary deleted');
    });
};
exports.search = function (req, res) {
    db.summary.findAll({
        where: {
            vehicleNo: req.query.id
        }
    })
        .then(function (summary) {
            if (!summary) {
                return res.failure('no summary found');
            }
            return res.data(mapper.toSearchModel(summary));
        }).catch(function (err) {
            return res.failure(err);
        });
};