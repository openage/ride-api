'use strict'

const db = require('../../../../models')
const sendIt = require('../../../../providers/sendIt')

exports.process = async (data, context) => {
    context.logger.start('processor:rating:rejected')

    let rating = await db.rating.findById(data.id).populate({
        path: 'vehicle',
        populate: {
            path: 'owner'
        }
    })

    sendIt.send({id: rating.id}, 'notify-tenant-admin-on-rating-rejected', [{}],
        rating.vehicle.owner.role.key,
        ['email']).then((response) => {
            context.logger.info('email delivered')
        })


}