'use strict'
const db = require('../../../../models')
const sendIt = require('../../../../providers/sendIt')

exports.process = async (data, context) => {
    const trip = await db.trip.findById(data.id).populate('passengers driver')

    let passengerRoleList = []

    trip.passengers.forEach(passenger => {
        let passengerRole = {
            roleKey: passenger.role.key
        }
        passengerRoleList.push(passengerRole)
    })

    return sendIt.send({dropLocation: trip.destination.description}, 'notify-passengers-on-trip-complete', passengerRoleList, trip.driver.role.key, ['push']).then((response) => {
        context.logger.info('push delivered')
    })
}
