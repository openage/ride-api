'use strict'
var _ = require('underscore')

exports.toModel = function (entity) {
    var model = {
        id: entity.id,
        name: entity.name,
        createAt: entity.createAt,
        updateAt: entity.updateAt
    }
    if (entity.vehicle) {
        var vehicle = {
            id: entity.vehicle.id,
            code: entity.vehicle.vehicleNo != null ? entity.vehicle.vehicleNo : null,
            picUrl: entity.vehicle.picUrl != null ? entity.vehicle.picUrl : null,
            capacity: entity.vehicle.capacity != null ? entity.vehicle.capacity : null
        }
        model.vehicle = vehicle
    }
    if (entity.user) {
        name = entity.user.name,
        code = entity.user.code
    }
    if (entity.organization) {
        var organization = {
            id: entity.organization.id,
            code: entity.organization.code,
            name: entity.organization.name
        }
        model.organization = organization
    }
    return model
}
exports.toSearchModel = function (entities) {
    return _.map(entities, exports.toModel)
}
