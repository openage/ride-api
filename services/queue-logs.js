'use strict'

const create = async (model, context) => {
    const log = context.logger.start('create')

    return await new db.queueLogs(model).save()
}

const getById = async (id, context) => {
    const log = context.logger.start('getById')

    return await db.queueLogs.findOne({ _id: id })
}

exports.create = create
exports.getById = getById
