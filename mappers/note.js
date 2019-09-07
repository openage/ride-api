'use strict'
var _ = require('underscore')

exports.toModel = function (entity) {
    var model = {
        id: entity.id,
        text: entity.text

    }
    if (entity.user) {
        name = entity.user.name,
        code = entity.user.code
    }
    if (entity.trip) {
        id = entity.trip.id,
        source = entity.trip.source
    }
    return model
}
exports.toSearchModel = function (entities) {
    return _.map(entities, exports.toModel)
}
