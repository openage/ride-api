'use strict'

const offline = require('@open-age/offline-processor')
const updateScheme = require('../helpers/updateEntities')

const create = async (model, context) => {
    context.logger.start('create')

    let rating = await new db.rating(model).save()

    context.processSync = true
    offline.queue('rating', 'create', { id: rating.id }, context)

    return rating
}

const getById = async (id, context) => {
    context.logger.start('getById')

    return await db.rating.findById(id).populate({
        path: 'vehicle driver trip passengers'
    })
}

let ratingCount = (model) => {
    let countQuery = {
        rate: {
            $exists: true
        }
    }

    if (model.vehicle) {
        countQuery.vehicle = model.vehicle
    }

    if (model.driver) {
        countQuery.driver = model.driver
    }

    return db.rating.find(countQuery).count()
}

let reviewCount = (model) => {
    let countQuery = {
        comment: {
            $exists: true
        }
    }

    if (model.vehicle) {
        countQuery.vehicle = model.vehicle
    }

    if (model.driver) {
        countQuery.driver = model.driver
    }

    return db.rating.find(countQuery).count()
}

let starCount = (model) => {
    let query = {}

    if (model.vehicle) {
        query.vehicle = toObjectId(model.vehicle.id)
    }

    if (model.driver) {
        query.driver = toObjectId(model.driver.id)
    }

    return db.rating.aggregate([{
        $match: query
    },
    {
        $group: {
            _id: '$rate',
            count: { $sum: 1 }
        }
    }

    ])
}

const update = async (model, rating, context) => {
    context.logger.start('services:rating:update')

    let updatedRating = await updateScheme.update(model, rating).save()

    context.processSync = true
    offline.queue('rating', model.status, { id: updatedRating.id }, context)

    return updatedRating
}

exports.create = create
exports.starCount = starCount
exports.reviewCount = reviewCount
exports.ratingCount = ratingCount
exports.getById = getById
exports.update = update