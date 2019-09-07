'use strict'

const db = require('../../../../models')
const sendIt = require('../../../../providers/sendIt')

exports.process = async (data, context) => {
    let log = context.logger.start('process:rating:create:notify-pas')

    let rating = await db.rating.findById(data.id).populate(' passenger').populate({
        path: 'vehicle',
        populate: {
            path: 'owner'
        }
    })

    return sendIt.send({ ratingId: rating.id }, 'notify-passenger-on-rating-published',
        [{ roleKey: rating.passenger.role.key }],
        rating.vehicle.owner.role.key, ['push']).then((response) => {
            log.end()
            context.logger.info('push delivered')
        })

}