'use strict'
var _ = require('underscore')

exports.toModel = function (entity) {
    var model = {
        id: entity.id,
        name: entity.name,
        code: entity.code,
        createAt: entity.createAt,
        updateAt: entity.updateAt
    }
    return model
}
exports.toSearchModel = function (entities) {
    return _.map(entities, exports.toModel)
}
