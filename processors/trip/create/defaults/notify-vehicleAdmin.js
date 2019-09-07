'use strict'
const db = require('../../../../models')
const sendIt = require('../../../../providers/sendIt')

exports.process = async (data, context) => {
    const trip = await db.trip.findById(data.id).populate({
        path: 'vehicle passengers',
        populate: {
            path: 'owner'
        }
    })

    return sendIt.send({ vehicleNo: trip.vehicle.vehicleNo }, 'notify-vehicle-admin-on-trip-creation',
        [{ roleKey: trip.vehicle.owner.role.key }], trip.passengers[0].role.key, ['push']).then((response) => {
        context.logger.info('push delivered')
    })
}
