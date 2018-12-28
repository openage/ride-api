'use strict';
var async = require('async');
var updateField = require('../helpers/dbQuery').updateFields;
var auth = require('../middleware/authorization');
var db = require('../models/index');
var mapper = require('../mappers/trip');
var moment = require('moment');
var responseHelper = require('../helpers/response');
var path = require('path');

var vehicleService = require('../services/vehicles')


exports.create = function (req, res) {
    var data = req.body;
    async.waterfall([
        function (cb) {
            if (!data.vehicleNo) {
                res.failure("vehileNo is required");
            }
            db.user.find({
                where: { id: data.adminId }
            }).then(function (admin) {
                data.admin = admin;
                cb(null);
            })
                .catch(function (err) {
                    return cb(err);
                });
        }, function (cb) {
            db.vehicle.find({
                where: {
                    vehicleNo: data.vehicleNo
                }
            }).then(function (vehicle) {
                cb(null, vehicle);
            }).catch(function (err) {
                return cb(err);
            });
        },
        function (vehicle, cb) {
            if (!vehicle) {
                res.failure("no vehicle found");
            }


            db.trip.build({
                adminId: data.adminId,
                vehicleNo: data.vehicleNo,
                employeeId: data.employeeId,
                purpose: data.purpose,
                destination: data.destination,
                time: data.time || null,
                duration: data.duration,
                driverId: data.driverId,
                status: data.status || 'start',
                date: data.date,
                passengers: data.passengers,
                rejectionReason: data.rejectionReason,
                tripMessage: data.tripMessage,
                vehicleType: data.vehicleType,
                model:data.model,
                type:data.type,
                vehicleId:vehicle.id,
            }, {
                    include: [{ model: db.user, as: 'admin' },{model:db.vehicle,as:'vehicle'}]
                }).save().then(function (newTrip) {
                    if (!newTrip) {
                        return cb("could not create trip");
                    }
                    // if(data.status==='approve'){
                    // require('../helpers/scheduler').build(data)
                    // }
                    // vehicle.availability='busy';
                    // vehicle.save();              


                    return cb(null, newTrip);
                })
        }
    ], function (err, trip) {
        if (err) {
            return res.failure(err);
        }
        return res.data(mapper.toModel(trip));
    });
};
exports.get = function (req, res) {
    db.trip.findOne({
        where: { id: req.params.id },
        include: [{ model: db.user, as: 'employee' }, { model: db.user, as: 'driver' },{model:db.vehicle, as: 'vehicle'}]
    }).then(function (trip) {
        if (!trip) {
            return res.failure('no trips found');
        }

        return res.data(mapper.toModel(trip));
    }).catch(function (err) {
        res.failure(err);
    });
};
exports.update = function (req, res) {
    let data = req.body;
    Promise.all([
        db.trip.findOne({
            where: {
                id: req.params.id
            }
        }),
        vehicleService.find({
            vehicleNo: data.vehicleNo,
            type: data.vehicleType,
            picUrl: data.fileUrl || data.picUrl,
            capacity: data.capacity,
            employeeId: data.employee.id,
        }),
        db.user.find({
            where: { id: data.adminId }
        })
    ]).spread((trip, vehicle, admin) => {
        // if (!vehicle) {
        //     return res.failure('no vehicle found');
        // }

        trip.employee = data.employee;
        trip.purpose = data.purpose;
        trip.destination = data.destination;
        trip.time = data.time || null;
        trip.duration = data.duration;
        trip.status = data.status;
        trip.vehicleNo = data.vehicleNo;
        trip.date = data.date;
        trip.driverId = data.driver ? data.driver.id : null;
        trip.passengers = data.passengers;
        trip.rejectionReason = data.rejectionReason;
        trip.tripMessage = data.tripMessage;
        trip.source = data.source;
        trip.model = data.model;
        trip.type = data.type;
        trip.vehicleId = vehicle!=null?vehicle.id:null;
        trip.adminId = admin!=null?admin.id:null;
        include: [{ model: db.user, as: 'employee' }, { model: db.user, as: 'driver' },{model:db.vehicle, as: 'vehicle'}],
        trip.save().then(trip => {
            return res.data(mapper.toModel(trip));
        });
    }).catch(error => {
        return res.failure(err);
    });
};
exports.delete = function (req, res) {
};
exports.search = function (req, res) {
    var pageNo = 1;
    var pageSize = 10;
    if (req.query.pageNo) {
        pageNo = req.query.pageNo;
    }
    if (req.query.pageSize) {
        pageSize = req.query.pageSize;
    }
    var whereQuery = {};
    var filters = {
        status: req.query.status || '',
        date: req.query.date || '',
        employeeId: req.query.employeeId || '',
        driverId: req.query.driverId || '',
        vehicleNo: req.query.vehicleNo || '',
    }

    if (filters.vehicleNo) {
        whereQuery.vehicleNo = {
            $like: '%' + filters.vehicleNo + '%'
        };
    }
    if (filters.status) {
        whereQuery.status = filters.status
    }
    if (req.query.date) {
        let fromDate = moment(req.query.date).startOf('day'),
            toDate = moment(req.query.date).endOf('day');
        whereQuery.date = {
            $gte: fromDate,
            $lt: toDate
        };
    }
    if (req.query.history) {
        whereQuery.date = {
            $lt: moment().startOf('day'),

        }

    }
    if (req.query.showFutureTrip) {
        whereQuery.date = {
            $gte: moment().startOf('day'),

        }
    }
    if (req.query.cancelReject) {
        whereQuery.status = {
            $in: ['reject', 'cancel']

        }

    }
    if (filters.employeeId) {
        whereQuery.employeeId = filters.employeeId
    }

    if (filters.driverId) {
        whereQuery.driverId = filters.driverId
    }

    async.parallel([
        callback => {
            db.trip.findAndCountAll({
                offset: 10, limit: 10,

                where: whereQuery,
                order: [
                    ['date', 'DESC'],

                ]
            }).then(function (tripCounts) {
                return callback(null, tripCounts)
            })
        },
        callback => {
            db.trip.findAll({
                where: whereQuery,
                order: [
                    ['date', 'DESC'],

                ],
                include: [{ model: db.user, as: 'employee' }, { model: db.user, as: 'driver' },{model:db.vehicle,as:'vehicle'}]
            }).then(function (trips) {
                return callback(null, trips)
            })
        }
    ],
        (err, results) => {
            if (err) {
                return res.failure('no trips found');
            }
            return res.page(mapper.toSearchModel(results[1]), 1, 5, results[0].count);

            //   return res.page(mapper.toSearchModel(results[1]), 1, 5, results[0].count);


        });



};
exports.today = function (req, res) {
    db.trip.findAll({
        where: {
            vehicleNo: req.params.id,
            date: {
                $lt: new Date(),
                $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
            }
        }
    }).then(function (result) {
        return res.data(mapper.toSearchModel(result));
    }).catch(function (err) {
        return res.failure(err);
    });
};
exports.getAwaitingApporval = function (req, res) {
    db.trip.findAll({
        where: {
            adminId: req.user.id,
            status: "start"
        }
    }).then(function (trips) {
        res.data(mapper.toSearchModel(trips));
    }).catch(function (err) {
        res.failure(err);
    })
};
exports.getApprovedByDate = function (req, res) {
    db.trip.findAll({
        where: {
            date: {
                $lte: new Date(req.query.date),
                $gte: new Date(new Date(req.query.date) - 24 * 60 * 60 * 1000)
            },
            adminId: req.user.id,
            status: "approve"
        }
    }).then(function (trips) {
        res.data(mapper.toSearchModel(trips));
    }).catch(function (err) {
        res.failure(err);
    })
};

exports.requestTrip = function (req, res) {
    var data = req.body;
    Promise.all([
        vehicleService.find({
            vehicleNo: data.vehicleNo,
            type: data.vehicleType,
            picUrl: data.fileUrl || data.picUrl,
            capacity: data.capacity,
            employeeId: data.employee.id,
        }),
        db.user.find({
            where: { id: data.adminId }
        })
    ]).spread((vehicle, admin) => {
       
        db.trip.build({
                        adminId: data.adminId || null,
                        vehicleNo: data.vehicleNo,
                        employeeId: data.employee.id,
                        purpose: data.purpose,
                        destination: data.destination,
                        time: data.time || null,
                        duration: data.duration,
                        driver: data.driver,
                        status: data.status || 'start',
                        date: data.date,
                        passengers: data.passengers,
                        rejectionReason: data.rejectionReason,
                        tripMessage: data.tripMessage,
                        vehicleType: data.vehicleType,
                        source: data.source,
                        model: data.model,
                        type: data.type,
                        vehicleId: vehicle != null ? vehicle.id : null,
                       }).save().then(function (trip) {
                                    if (!trip) {
                                        return cb("could not create trip");
                                    }
                                    return res.data(mapper.toModel(trip));
                                })
      
    }).catch(error => {
        return res.failure(err);
    });
};
  
exports.setTripStatus = function (req, res) {
    var data = req.body;
    db.trip.findOne({
        where: {
            id: data.id
        }
    }).then(function (trip) {
        if (data.status == "reject") {
            trip.rejectionReason = data.rejectionReason
        }
        trip.tripMessage = data.tripMessage
        trip.status = data.status,
            trip.save().then(function (trip) {
                return res.data(mapper.toModel(trip), 'updated');

            }).catch(function (err) {
                return res.failure(err);

            });
    }).catch(function (err) {
        return res.failure(err);
    })
};
exports.tripExcelExport = function (req, res) {
    var response = responseHelper(res);
    var whereQuery = {};
    var filters = {
        status: req.query.status || '',
        date: req.query.date || '',
        employeeId: req.query.employeeId || '',
        driverId: req.query.driverId || '',
        vehicleNo: req.query.vehicleNo || '',
    }

    if (filters.vehicleNo) {
        whereQuery.vehicleNo = {
            $like: '%' + filters.vehicleNo + '%'
        };
    }
    if (filters.status) {
        whereQuery.status = filters.status
    }
    if (req.query.date) {
        let fromDate = moment(req.query.date).startOf('day'),
            toDate = moment(req.query.date).endOf('day');
        whereQuery.date = {
            $gte: fromDate,
            $lt: toDate
        };
    }

    if (filters.employeeId) {
        whereQuery.employeeId = filters.employeeId
    }

    if (filters.driverId) {
        whereQuery.driverId = filters.driverId
    }


    db.trip.findAll({
        where: whereQuery,
        include: [{ model: db.user, as: 'employee' }, { model: db.user, as: 'driver' },{model:db.vehicle,as: 'vehicle'}]
    })

        .then(function (trips) {
            if (!trips) {
                return res.failure('no trip found');
            }
            require('../exporter/tripExcel').build(trips, (err, file) => {
                if (err) {
                    return response.failure(err);
                }
                response.download(file.path, file.name);

            });
        })

};
