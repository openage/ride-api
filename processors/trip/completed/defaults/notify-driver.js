'use strict'

const db = require('../../../../models')
const sendIt = require('../../../../providers/sendIt')

exports.process = async (data, context) => {
    const trip = await db.trip.findById(data.id).populate('driver')

    return sendIt.send({dropLocation: trip.destination.description}, 'notify-driver-on-trip-complete',
        [{ roleKey: trip.driver.role.key }], trip.driver.role.key, ['push']).then((response) => {
        context.logger.info('push delivered')
    })
}
