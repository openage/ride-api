'use strict';
var async = require('async');
var updateField = require('../helpers/dbQuery').updateFields;
var auth = require('../middleware/authorization');
var db = require('../models/index');
var mapper = require('../mappers/document');
var fs = require('fs');
var path = require('path');
var fileUploader = require('../helpers/fileUploader');
var moment = require('moment');

var create = (vehicle, data, cb) => {
    db.documents.build({
        vehicleId: vehicle.id,
        name: data.name,
        date: data.date,
        isArchive: false,
        documentPath: data.fileUrl,
        userId: data.user.id
    }).save().then(document => {
        if (!document) {
            cb('Unable to create document');
        }
        cb(null, vehicle, document);
    });
};

var find = (vehicle, data, cb) => {
    db.documents.find({
        where: {
            vehicleId: vehicle.id,
            name: data.name,
            isArchive: false
        },
        include: [{ model: db.user }, { model: db.vehicle }]
    }).then(document => {
        cb(null, document);
    });
};
exports.create = (req, res) => {
    var data = req.query;
    data.user = req.user;
    var endDate, smsNotify, emailNotify;
    async.waterfall([
        cb => {
            if (!data.vehicleNo) {
                cb('vehileNo is required');
            }
            db.vehicle.find({
                where: {
                    vehicleNo: data.vehicleNo
                }
            }).then(vehicle => {
                if (!vehicle) {
                    cb('vehicle not found');
                }
                cb(null, vehicle);
            });
        },
        (vehicle, cb) => {
            db.documents.find({
                where: {
                    vehicleId: vehicle.id,
                    name: data.name,
                    isArchive: false
                },
                include: [{ model: db.user }, { model: db.vehicle }]
            }).then(doc => {
                if (doc) {
                    doc.isArchive = true; //For Archiving Old Document
                    doc.save().then(doc => {
                        create(vehicle, data, cb);
                    });
                } else {
                    create(vehicle, data, cb);
                }
            }).catch((err)=>{
                console.log(err);
            });
        },
        (vehicle, document, cb) => {
            db.alerts.findAll({
                where: {
                    vehicleId: vehicle.id,
                    type: data.name
                }
            }).then(alerts => {
                if (!alerts) {
                    cb(null, vehicle, document);
                }
                alerts.forEach(alert => {
                    if (alert.status !== 'closed') {
                        alert.status = 'closed';
                        alert.save();
                    }
                });
                cb(null, vehicle, document);
            });
        },
        (vehicle, document, cb) => {
            endDate = moment(document.date).format('L');
            smsNotify = moment(endDate).subtract(10, 'days'); // By default 10 days
            smsNotify = moment(smsNotify._d).format('L');
            emailNotify = moment(endDate).subtract(10, 'days'); // by default 10 days
            emailNotify = moment(emailNotify._d).format('L');
            db.alerts.build({
                vehicleId: vehicle.id,
                endDate: endDate,
                type: document.name,
                smsNotify: smsNotify,
                emailNotify: emailNotify,
                status: 'open', //by default status is open
                dailyReminder: true
            }).save().then(alert => {
                if (!alert) {
                    cb('unable to create alert');
                }
                cb(null, vehicle, document);
            });
        },
        (vehicle, document, cb) => {
            find(vehicle, data, cb);
        }
    ], (err, document) => {
        if (err) {
            return res.failure(err);
        }
        return res.data(mapper.toModel(document));
    });
};
exports.search = (req, res) => {
    async.waterfall([
        cb => {
            db.vehicle.findOne({
                where: {
                    vehicleNo: req.query.vehicleNo,
                }
            }).then(vehicle => {
                if (!vehicle) {
                    cb('vehicle not found');
                }
                cb(null, vehicle);
            });
        },
        (vehicle, cb) => {
            db.documents.findAll({
                where: {
                    vehicleId: vehicle.id
                },
                include: [{ model: db.user }, { model: db.vehicle }]
            }).then(documents => {
                if (!documents) {
                    cb('no document found');
                }
                cb(null, documents);
            });
        }
    ], (err, document) => {
        if (err) {
            return res.failure(err);
        }
        return res.data(mapper.toSearchModel(document));
    });
};
exports.delete = function(req, res) {
    async.waterfall([
        function(cb) {
            db.documents.findOne({ vehicleNo: req.params.id }, cb);
        },
        function(document, cb) {
            document.delete(cb);
        }
    ], function(err, document) {
        if (err) {
            return res.failure(err);
        }
        return res.success('document deleted');
    });
};