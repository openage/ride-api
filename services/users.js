'use strict'

const getByIdOrContext = async (id, context) => {
    context.logger.start('service/users: getByIdOrContext')

    let userId = id || context.user.id

    return await db.user.findById(id)
}

exports.getByIdOrContext = getByIdOrContext
