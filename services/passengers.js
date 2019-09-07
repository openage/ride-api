'use strict'

const imageService = require('./images')
const updateScheme = require('../helpers/updateEntities')

const getById = async (id, context) => {
    context.logger.start('services/passengers:getById')

    return await db.passenger.findById(id)
}

const updateByDirectory = async (data, context) => {
    let log = context.logger.start('services:passengers:updateByDirectory')

    if (!data) { return }

    let passengerModel = {
        role: {
            id: data._id,
            key: data.key,
            code: data.code,
            permissions: data.permissions
        },
        email: data.user.email,
        phone: data.user.phone,
        profile: data.user.profile || {}
    }

    if (data.user.picUrl && !data.user.profile.pic) {
        let pic = {
            url: data.user.picUrl,
            data: await imageService.thumbnailFromUrl(data.user.picUrl)
        }
        passengerModel.profile.pic = pic
    }

    let passenger = await db.passenger.findOne({ 'role.id': data._id })

    return updateScheme.update(passengerModel, passenger).save()

}

exports.updateByDirectory = updateByDirectory
exports.getById = getById