'use strict';
var _ = require('underscore');

exports.toModel = function (entity) {
    return {
        // vehicleNo: entity.vehicleNo,
        // type: entity.type,
        // availability: entity.availability,
        // picUrl: entity.image,
        // driver: entity.driver,
        summary:{
                vehicleNo: entity.vehicleNo,
                fuelEfficiancy: entity.fuelEfficiancy,
                odoMeter: entity.odoMeter,
                taksDue: entity.taksDue
        }
    };
};
exports.toSearchModel = function(entities) {
    return _.map(entities, exports.toModel);
};
