'use strict';
var _ = require('underscore');
exports.toModel = function (entity) {
    var model = {
        // adminId:entity.adminId,
        id: entity.id,
        name: entity.name,
        code:entity.code,
        phone: entity.phone,
        email: entity.email,
        vehicleNo: entity.vehicleNo,
        purpose: entity.purpose,
        destination: entity.destination,
        time: entity.time,
        duration: entity.duration,
        status: entity.status,
        source:entity.source,

        // status: entity.status==='approve'? 'approved':entity.status ==="cancel"? 'cancelled': 'rejected' ,
        date: entity.date,
        passengers: entity.passengers,
        rejectionReason: entity.rejectionReason,
        tripMessage: entity.tripMessage,
        vehicleType: entity.vehicleType,
        type:entity.type,
        model:entity.model,

    };
    if(entity.employee){
        var employee ={
            id: entity.employee.id,
            code: entity.employee.code,
            name: entity.employee.name,
            email: entity.email
        }
        model.employee = employee;
    }
    if(entity.driver){
        var driver ={
            id: entity.driver.id,
            code: entity.driver.code,
            name: entity.driver.name,
            phone: entity.driver.phone
        }
        model.driver = driver;
    }
    if(entity.admin){
        var admin ={
            id: entity.admin.id,
            code: entity.admin.code,
            name: entity.admin.name
        }
        model.admin = admin;
    }
    if(entity.vehicle){
        var vehicle ={
            id: entity.vehicle.id,
            picUrl: entity.vehicle.picUrl,
            capacity: entity.vehicle.capacity
        }
        model.vehicle = vehicle;
    }
    

    return model;
};
exports.toSearchModel = function (entities) {
    return _.map(entities, exports.toModel);
};