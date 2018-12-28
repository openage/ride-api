'use strict';
var async = require('async');
var updateField = require('../helpers/dbQuery').updateFields;
var auth = require('../middleware/authorization');
var db = require('../models/index');
var moment = require('moment');
var mapper = require('../mappers/vehicle');
var mapper2 = require('../mappers/fuelLog');
var mapper3 = require('../mappers/service');
var fileUploader = require('../helpers/fileUploader');
var path = require('path');
var fs = require('fs');

exports.create = function(req, res) {
    var data = req.body;
    var where = {};
    if (!data.vehicleNo) {
        res.failure('vehicleNo is required');
    }
    where.vehicleNo = data.vehicleNo;
    
    async.waterfall([
        function(cb) {
            db.vehicle.find({
                where: where
            }).then(function(vehicle) {
                if (!vehicle) {
                    db.vehicle.build({
                        vehicleNo: data.vehicleNo,
                        type: data.type,
                        availability: data.availability,
                        picUrl: data.fileUrl || data.picUrl,
                        capacity: data.capacity
                    }).save().then(function(newVehicle) {
                        if (!newVehicle) {
                            return cb("could not create vehicle");
                        }
                        cb(null, newVehicle);
                    });
                } else {
                    cb('vehicle already exists');
                }
            }).catch(cb);
        },
        function(vehicle, cb) {
            if (data.vehicleNo) {
                vehicle.availability = db.vehicle.AVAILABILITY.AVAILABLE;
            } else if (vehicle.availability === db.vehicle.AVAILABILITY.BUSY) {
                return cb("vehicle is already registered");
            } else {
                vehicle.availability = db.vehicle.AVAILABILITY.AVAILABLE;
            }
            vehicle.save()
                .then(function(savedVehicle) {
                    cb(null, savedVehicle);
                }).catch(cb);
        }
    ], function(err, vehicle) {
        if (err) {
            return res.failure(err);
        }
        return res.data(mapper.toModel(vehicle));
    });
};
exports.get = function(req, res) {
    let tasksDue = 0;
    let mappedData;
    db.vehicle.findOne({
        where: {
            vehicleNo: req.params.id
        }
    }).then(function(vehicle) {
        if (!vehicle) {
            return res.failure('no vehicles found');
        }
        db.alerts.findAll({
            where: {
                vehicleId: vehicle.id
            }
        }).then(alerts => {
            if (alerts) {
                // alerts.forEach(alert => { //TODO : FILTERING TASKSDUE
                //     var today = moment().format('L');
                //     var smsNotify = moment(alert.smsNotify).format('L');
                //     var tasks = moment(today).subtract(smsNotify, 'days');
                //     if (tasks === 0) {
                //         tasksDue++;
                //     }
                // });
                mappedData = mapper.toModel(vehicle);
                mappedData.tasksDue = tasksDue;
                return res.data(mappedData);
            } else {
                mappedData = mapper.toModel(vehicle);
                mappedData.tasksDue = tasksDue;
                return res.data(mappedData);
            }
        });
    }).catch(function(err) {
        return res.failure(err);
    });
};
exports.update = function(req, res) {
    var data = req.body;
    var id = 0;
    id = data.id ? req.params.id : 0;
    db.vehicle.findOne({
        where: {
            id: id
        }
    }).then(function(vehicle) {

        vehicle.picUrl = data.fileUrl || data.picUrl;
        vehicle.vehicleNo = data.vehicleNo;
        vehicle.type = data.type;
        vehicle.capacity = data.capacity;
        vehicle.driver = data.driver;
        vehicle.fuelEfficiency = data.fuelEfficiency;
        vehicle.odoMeter = data.odoMeter;
        vehicle.availability = data.availability;
        vehicle.status = data.status;
        vehicle.save().then(function(vehicle) {
            res.data(mapper.toModel(vehicle), 'updated');
        }).catch(function(err) {
            return res.failure(err);
        });
    }).catch(function(err) {
        return res.failure(err);
    });
};
exports.delete = function(req, res) {
    db.vehicle.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.success('Vehicle deleted')
    });
    // async.waterfall([
    //     function(cb) {
    //         db.vechicle.destroy({ id: req.params.id }, cb);
    //     },
    //     function(vehicleNo, cb) {
    //         vehicle.delete(cb); // todo - delete profile
    //     }
    // ], function(err, vehicleNo) {
    //     if (err) {
    //         return res.failure(err);
    //     }
    //     return res.success('user deleted');
    // });
};
exports.search = function(req, res) {
    var whereQuery ={};
    var filters = {
        availability: req.query.availability || '',
        type: req.query.type || '',
        vehicleNo: req.query.vehicleNo || '',
        capacity: req.query.capacity || ''  ,
        employeeId:req.query.employeeId ||'', 
    }
    if (filters.vehicleNo) {
        whereQuery.vehicleNo = {
            $like: '%' + filters.vehicleNo + '%'
        };
    }
    if (filters.type) {
        whereQuery.type = filters.type;
    }
    if (filters.availability) {
        whereQuery.availability = filters.availability;
    }
    if (filters.capacity) {
        // whereQuery.capacity = filters.capacity
        whereQuery.capacity = {
            $gte: filters.capacity      
            };
        }
    if(filters.employeeId){
        whereQuery.employeeId = filters.employeeId;
    }
    else
    {
        whereQuery.employeeId  = null;
    }
    db.vehicle.findAll({
            where: whereQuery,
            // order: ['capacity DESC']    
            order: [
                ['capacity', 'ASC'],
               
            ]           
        })
        
        .then(function(vehicle) {
            if (!vehicle) {
                return res.failure('no vehicles found');
            }
            return res.data(mapper.toSearchModel(vehicle));
        }).catch(function(err) {
            return res.failure(err);
        })
}
exports.getfuelLogs = function(req, res) {
    db.fuelLogs.findAll({
            where: {
                vehicleNo: req.params.id
            }
        })
        .then(function(logs) {
            if (!logs) {
                return res.failure('no logs found');
            }
            return res.data(mapper2.toSearchModel(logs));
        }).catch(function(err) {
            return res.failure(err);
        });
};
exports.getserviceLogs = function(req, res) {
    db.servicelLogs.findAll({
            where: {
                vehicleNo: req.params.id
            }
        })
        .then(function(logs) {
            if (!logs) {
                return res.failure('no logs found');
            }
            return res.data(mapper3.toSearchModel(logs));
        }).catch(function(err) {
            return res.failure(err);
        });
};
exports.getalerts = function(req, res) {
    var status = "panding";
    if (req.query.dueOnly) {
        status = "%";
    }
    db.alerts.findAll({
        where: {
            vehicleNo: req.params.id,
            status: { $like: status }
        }
    }).then(function(logs) {
        if (!logs) {
            return res.failure('no logs found');
        }
        return res.data(mapper3.toSearchModel(logs));
    }).catch(function(err) {
        return res.failure(err);
    });
};
exports.findVehicles = function(req, res) {
    var where = {
        where: {
            //type: req.query.type,
            //capecity:parseInt(req.query.capecity)
            availability: "available"
        }
    };
    db.vehicle.findAll(where)
        .then(function(vehicle) {
            res.data(mapper.toSearchModel(vehicle));
        }).catch(function(err) {
            res.failure(err);
        });
};
exports.vehicleImages = function(req, res) {
    var data = req.query;
    if (!data.vehicleNo) {
        return res.failure("vehicle is required");
    }

    db.vehicle.findOne({
        where: {
            vehicleNo: data.vehicleNo
        }
    }).then(function(vehicle) {
        if (!vehicle) {
            return res.failure('vehicle not Found');
        }
        if (vehicle) {
            vehicle.picUrl = data.fileUrl;
            vehicle.save();
            return res.data(mapper.toModel(vehicle));
        }
    }).catch(function(err) {
        return res.failure(err);
    });
};
exports.getImage = function(req, res) {
    db.vehicle.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(vehicle) {
        res.data(vehicle.picUrl);
    }).catch(function(err) {
        res.failure(err);

    })
};