// 'use strict'

// const db = require('../../../../models')
// const sendIt = require('../../../../providers/sendIt')
// var moment = require('moment')

// exports.process = async (data, context) => {

//     const trip = await db.trip.findById(data.id).populate('driver')

//     return sendIt.send({startTime: moment(trip.startTime).format('YYYY-MM-DD hh:mm:ss a')}, 'notify-driver-on-trip-start',
//         [{ roleKey: trip.driver.role.key }], trip.driver.role.key, ['push']).then((response) => {
//             context.logger.info('push delivered')
//         })

// }
