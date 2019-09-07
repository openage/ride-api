'use strict'
const db = require('../../../../models')
const sendIt = require('../../../../providers/sendIt')
const googleMaps = require('../../../../providers/googleMaps')

exports.process = async (data, context) => {
    const trip = await db.trip.findById(data.id).populate('driver vehicle passengers')

    let passengerRoleList = []

    trip.passengers.forEach(passenger => {
        let passengerRole = {
            roleKey: passenger.role.key
        }
        passengerRoleList.push(passengerRole)
    })

    return sendIt.send({
        pickUp: trip.origin.description
    },
    'notify-driver-on-trip-canceled', [{ roleKey: trip.driver.role.key }],
    passengerRoleList[0].roleKey, ['push']).then((response) => {
        context.logger.info('push delivered')
    })
}
