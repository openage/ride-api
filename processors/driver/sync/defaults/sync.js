'use strict'

const logger = require('@open-age/logger')('actionHandlers/employee/sync')
const driverService = require('../../../../services/drivers')
const queueLogs = require('../../../../services/queue-logs')

exports.process = async (data, context, callback) => {
    let log = logger.start(`process-${data.id}`)

    const queueLog = await queueLogs.getById(data.id, context)

    if (!queueLog) {
        return callback()
    }

    return driverService.syncDriver(queueLog.data, queueLog.context).then(() => {
        log.info('driver updated')
        return callback()
    }).catch((err) => {
        log.error(err)
        return callback(err)
    })
}
