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

//     return sendIt.send({endTime: moment(trip.endTime).format('YYYY-MM-DD hh:mm:ss a'), vehicleNo: trip.vehicle.vehicleNo}, 'notify-admin-on-trip-complete',
//         [{ roleKey: trip.driver.role.key }], trip.driver.role.key, ['push']).then((response) => {
//             context.logger.info('push delivered')
//         })

// }
