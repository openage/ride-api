'use strict'

const offline = require('@open-age/offline-processor')
const queueLogs = require('../../../services/queue-logs')

exports.process = async (data, context, callback) => {
    const log = context.logger.start('process')

    const queueLog = await queueLogs.getById(data.id, context)

    if (!queueLog) {
        return callback()
    }

    offline.queue(queueLog.entity, queueLog.action, { id: queueLog.id }, context)
    return callback()
}
