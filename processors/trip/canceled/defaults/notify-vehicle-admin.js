// 'use strict'

// const db = require('../../../../models')
// const sendIt = require('../../../../providers/sendIt')
// var moment = require('moment')

// exports.process = async (data, context) => {

//     const trip = await db.trip.findById(data.id).populate({
//         path: 'vehicle driver',
//         populate: {
//             path: 'owner'
//         }
//     })

//     return sendIt.send({ vehicleNo: trip.vehicle.vehicleNo, pickUpLocation: trip.origin.description }, 'notify-admin-on-trip-canceled',
//         [{ roleKey: trip.driver.role.key }], trip.driver.role.key, ['push']).then((response) => {
//             context.logger.info('push delivered')
//         })

// }
