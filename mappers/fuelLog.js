"use strict";
var _ = require('underscore');
exports.toModel = function(entity) {
    return {
        id: entity.id,
        vehicleNo: entity.vehicleNo || entity.vehicleId, //todo remove en.vehicleNo
        date: entity.date,
        odoMeter: entity.odoMeter,
        fuel: entity.fuel,
        fuelType: entity.fuelType,
        rate: entity.rate,
        quantity: entity.quantity,
        driver: entity.driver,
        amount: entity.amount
    };
};
exports.toSearchModel = function(entities) {
    return _.map(entities, exports.toModel);
};