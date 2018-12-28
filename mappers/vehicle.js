'use strict';
var _ = require('underscore');

exports.toModel = function(entity) {

    return {
        id: entity.id,
        vehicleNo: entity.vehicleNo,

        type: entity.type,
        availability: entity.availability,
        picUrl: entity.picUrl,
        driver: entity.driver,
        capacity: entity.capacity,
        fuelEfficiency: entity.fuelEfficiency,
        odoMeter: entity.odoMeter,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
    };
};
exports.toSearchModel = function(entities) {
    return _.map(entities, exports.toModel);
};