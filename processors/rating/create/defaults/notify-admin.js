'use strict'

const db = require('../../../../models')
const sendIt = require('../../../../providers/sendIt')

exports.process = async (data, context) => {
    let log = context.logger.start('process:rating:create:notify-admin')

    let rating = await db.rating.findById(data.id).populate(' passenger').populate({
        path: 'vehicle',
        populate: {
            path: 'owner'
        }
    })

    return sendIt.send({ ratingId: rating.id }, 'notify-vehicle-admin-on-rating-create',
        [{ roleKey: rating.vehicle.owner.role.key }],
        rating.passenger.role.key, ['push']).then((response) => {
            context.logger.info('push delivered')
        })

}