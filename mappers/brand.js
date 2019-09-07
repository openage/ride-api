'use strict'

exports.toModel = (entity) => {
    let model = {
        name: entity.name
    }

    if (entity.models && entity.models.length) {
        model.models = entity.models.map((model) => {
           return { name: model.name }
        })

    }

    return model
}

exports.toSearchModel = (entities) => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}