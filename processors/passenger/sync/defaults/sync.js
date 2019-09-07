'use strict'

const queueLogServices = require('../../../../services/queue-logs')
const passengerService = require('../../../../services/passengers')

exports.process = async (data, context) => {
    let log = context.logger.start('processors:organization:sync')

    const queueLog = await queueLogServices.getById(data.id, context)

    if (!queueLog) { return }

    queueLog.context.logger = context.logger

    return passengerService.updateByDirectory(queueLog.data, queueLog.context).then(() => {
        log.info('passenger updated')
    }).catch((err) => {
        log.error(err)
        return err
    })
}