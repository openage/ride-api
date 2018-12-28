var db = require('../models/index');

exports.find = (data) => {
    return db.vehicle.find({
        where: {
            vehicleNo: data.vehicleNo
        }
    }).then(function (vehicle) {
        if (vehicle) {
            return vehicle;
        }
        db.vehicle.build({
            vehicleNo: data.vehicleNo,
            type: data.type,
            availability: "available",
            picUrl: data.picUrl,
            capacity: data.capacity,
            employeeId: data.employeeId,
        }).save().then(function(vehicle){
            return vehicle;
        });
    })
}