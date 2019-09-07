'use strict'
var _ = require('underscore')

exports.toModel = function (entity) {
    return {
        id: entity.id,
        vehicleNo: entity.vehicle.vehicleNo, // todo: remove vehiclEno
        startDate: entity.startDate,
        endDate: entity.endDate || new Date(),
        serviceOdoMeter: entity.odoMeter + 500,
        currentOdoMeter: entity.vehicle.odoMeter, // to adjust alert time
        type: entity.type,
        status: entity.status
    }
}
exports.toSearchModel = function (entities) {
    return _.map(entities, exports.toModel)
}
