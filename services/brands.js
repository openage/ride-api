'use strict'

const create = async (model, context) => {
    context.logger.start('services:brands:create')

    return new db.brand({
        name: model.name,
        models: model.models,
    }).save()
}

exports.create = create