'use strict'
var _ = require('underscore')

exports.toModel = function (entity) {
    return {
        // vehicleNo: entity.vehicle.vehicleNo, //todo: enttity.vehicleNo remove
        date: entity.date,
        odoMeter: entity.odoMeter,
        type: entity.type,
        name: entity.name,
        driver: entity.driver,
        amount: entity.amount
    }
}
exports.toSearchModel = function (entities) {
    return _.map(entities, exports.toModel)
}
