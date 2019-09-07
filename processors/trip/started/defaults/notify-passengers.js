'use strict'
const db = require('../../../../models')
const sendIt = require('../../../../providers/sendIt')
var moment = require('moment')

exports.process = async (data, context) => {
    const trip = await db.trip.findById(data.id).populate('passengers driver')

    let passengerRoleList = []

    trip.passengers.forEach(passenger => {
        let passengerRole = {
            roleKey: passenger.role.key
        }
        passengerRoleList.push(passengerRole)
    })

    return sendIt.send({startTime: moment(trip.startTime).format('YYYY-MM-DD hh:mm:ss a')}, 'notify-passengers-on-trip-start', passengerRoleList,
        trip.driver.role.key, ['push']).then((response) => {
        context.logger.info('push delivered')
    })
}
