'use strict'
var async = require('async')
var mapper = require('../mappers/fuelLog')

exports.create = async (req) => {
    var data = req.body
        let model = {
            date: req.body.date,
            odoMeter: req.body.odoMeter,
            fuelType: req.body.fuelType,
            rate: req.body.rate,
            quantity: req.body.quantity,
            amount: req.body.amount,
            vehicle: req.body.vehicle.id
        }
        (vehicle, fuelLog, cb) => {
            let odoMeterDifference = data.odoMeter - vehicle.odoMeter;
            //    toDO calculate fuelEfficiency
            let fuelQuantity = data.quantity;
            let fuelEfficiency = odoMeterDifference / fuelQuantity;

            vehicle.fuelEfficiency = fuelEfficiency;
            vehicle.odoMeter = data.odoMeter;
            vehicle.save().then(vehicle => {
                cb(null, fuelLog);
            }).catch(err => {
                cb(err);
            });
        },

    ], (err, savedFuelLog) => {
        if (err) {
            return res.failure(err);
        }
        return res.data(mapper.toModel(savedFuelLog));
    });
};
// exports.get = function(req, res) {
//     db.fuelLog.findOne({ where: { vechicleNo: req.params.id } }).then(function(fuelLog) {
//         if (!fuelLog) {
//             return res.failure('no Fuel Log found');
//         }
//         return res.data(mapper.toModel(fuelLog));
//     }).catch(function(err) {
//         res.failure(err);
//     });
// };
// exports.update = function(req, res) {
//     var data = req.body;
//     db.fuelLog.findOne({ where: { vehicleNo: req.params.id } })
//         .then(function(fuelLog) {
//             if (!fuelLog) {
//                 res.failure('no vehicle found');
//             }
//             fuelLog.fuelType = data.fuelType;
//             fuelLog.rate = data.rate;
//             fuelLog.amount = data.amount;
//             fuelLog.quantity = data.quantity;
//             fuelLog.date = data.date;
//             fuelLog.odoMeter = data.odoMeter;
//             fuelLog.driver = data.driver;
//             fuelLog.save().then(function(fuelLog) {
//                 return res.data(mapper.toModel(fuelLog, 'updated'))
//             }).catch(function(err) {
//                 return res.failure(err);
//             });
//         }).catch(function(err) {
//             res.failure(err);
//         });
// };
exports.delete = function(req, res) {
    async.waterfall([
        function(cb) {
            db.fuelLog.findOne({ vehicleNo: req.params.id }, cb);
        },
        function(fuelLog, cb) {
            fuelLog.delete(cb);
        }
    ], function(err, fuelLog) {
        if (err) {
            return res.failure(err);
        }
        return res.success('fuel log deleted');
    });
};

exports.search = (req, res) => {
    async.waterfall([
        cb => {
            db.vehicle.find({
                where: {
                    vehicleNo: req.query.vehicleNo
                }
            }).then(vehicle => {
                if (!vehicle) {
                    cb('vehicle not found');
                }
                cb(null, vehicle);
            });
        },
        (vehicle, cb) => {
            db.fuelLog.findAll({
                where: {
                    vehicleId: vehicle.id
                }
            }).then((fuelLog) => {
                if (!fuelLog) {
                    return res.failure('no fuelLog found');
                }
                cb(null, fuelLog);
            }).catch((err) => {
                cb(err);
            });
        },
    ], function(err, fuelLog) {
        if (err) {
            return res.failure(err);
        }
        return res.data(mapper.toSearchModel(fuelLog));
    });
};