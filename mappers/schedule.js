'use strict'
var _ = require('underscore')
exports.toModel = function (entity) {
    return {
        vehicleNo: entity.vehicleNo,
        time: entity.time,
        duration: entity.duration,
        destination: entity.destination,
        bookedBy: entity.bookedBy,
        driver: entity.driver,
        status: entity.status
    }
}
exports.toSearchModel = function (entities) {
    return _.map(entities, exports.toModel)
}
