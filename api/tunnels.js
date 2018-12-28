'use strict';
let tunnelUrl = require('config').get('defaultExtUrl');
let vehicleUrl = require('config').get('vehicleUrl');
let Client = require('node-rest-client').Client;
let client = new Client();
let async = require('async');
let db = require('../models/index');
let auth = require('../middleware/authorization');
let mapper = require('../mappers/user');

exports.create = function (req, res) {
    let currentUrl = tunnelUrl;

    if (!req.body.token) {
        return res.failure('external-token is required');
    }

    if (!req.body.orgCode) {
        return res.failure('org-code is required');
    }

    let args = {
        headers: {
            "Content-Type": "application/json",
            "orgCode": req.body.orgCode,
            "x-access-token": req.body.token
        }
    };
    async.waterfall([
        function (cb) {
            client.get(currentUrl, args, function (extData, response) {
                if (!extData) {
                    return cb(extData.error || extData.message);
                }
                cb(null, extData);
            });
        },
        function (extData, cb) {
            let eduUserId = extData.Id + req.body.orgCode;
            if (!extData.Mobile) {
                return cb('Mobile is required');
            }
            db.user.find({
                where: {
                    eduUserId: eduUserId
                }
            }).then(function (user) {
                if (!user) {
                    db.user.build({
                        phone: extData.Mobile,
                        email: extData.Email,
                        name: extData.Name,
                        gender: extData.Gender,
                        dob: extData.DOB,
                        code: extData.CurrentRole.Code,
                        username: extData.Code,
                        eduUserId: eduUserId,
                        //  isAdmin:false,
                    }).save().then(function (newUser) {
                        if (!newUser) {
                            return cb('unable to create user');
                        } else {
                            newUser.token = auth.getToken(newUser);
                            newUser.save().then(function (newUser) {
                                cb(null, newUser);
                            });
                        }
                    }).catch(cb);
                } else {
                    return cb(null, user);
                }
            });
        }
    ], function (err, user) {
        if (err) {
            return res.failure(err);
        }
        return res.data(mapper.toModel(user));
    });
};

exports.vehicleUpdate = (req, res) => {
    // if (!req.body.token) {
    //     return res.failure('external-token is required');
    // }

    // if (!req.body.orgCode) {
    //     return res.failure('org-code is required');
    // }

    let args = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    async.waterfall([
            cb => {
                client.get(vehicleUrl, args, function (extData, response) {
                    if (!extData) {
                        return cb(extData.error || extData.message);
                    }
                    cb(null, extData);
                });
            },
            (extData, cb) => {
                async.eachSeries(extData.items, (item, next) => {
                    db.vehicle.find({
                        where: {
                            vehicleNo: item.VehicleNo
                        }
                    }).then(vehicle => {
                        if (!vehicle) {
                            db.vehicle.build({
                                vehicleNo: item.VehicleNo,
                                type: 'Bus',
                                availability: 'available',
                                capacity: item.Capacity
                            }).save().then(newVehicle => {
                                if (!newVehicle) {
                                    cb('unable to create vehicle');
                                }
                                next();
                            });
                        } else {
                            next();
                        }
                    });
                }, (err) => {
                    if (err) {
                        cb(err);
                    }
                    cb(null);
                });
            }
        ],
        (err) => {
            if (err) {
                return res.failure(err);
            }
            return res.success('Successfully Updated');
        });
};
