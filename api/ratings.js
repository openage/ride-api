'use strict'

const ratingService = require('../services/ratings')
const tripService = require('../services/trips')
const mapper = require('../mappers/rating')

exports.create = async (req) => {
    let logger = req.context.logger.start('api:rating:create')

    let trip = await tripService.getById(req.body.trip.id, req.context)

    let model = {
        rate: req.body.rate,
        title: req.body.title,
        comment: req.body.comment,
        photos: req.body.photos,
        status: 'submitted',
        passenger: req.context.passenger,
        trip: trip.id,
        vehicle: trip.vehicle._doc ? trip.vehicle.id : trip.vehicle.toString(),
        driver: trip.driver._doc ? trip.driver.id : trip.driver.toString(),
        organization: trip.organization._doc ? trip.organization.id : trip.organization.toString()
    }

    let rating = await ratingService.create(model, req.context)

    return mapper.toModel(rating)
}

exports.get = async (req) => {
    let logger = req.context.logger.start('get')

    let rating = await ratingService.getById(req.params.id, req.context)

    return mapper.toModel(rating)
}

exports.search = async (req) => {
    let logger = req.context.logger.start('search')

    let pageNo = Number(req.query.pageNo)
    let pageSize = Number(req.query.pageSize)
    let toPage = (pageNo || 1) * (pageSize || 10)
    let fromPage = toPage - (pageSize || 10)
    let pageLmt = (pageSize || 10)

    let query = {}

    if (req.query.driverId) {
        query.driver = req.query.driverId
    }

    if (req.query.vehicleId) {
        query.vehicle = req.query.vehicleId
    }

    if (req.query.tripId) {
        query.trip = req.query.tripId
    }

    if (req.context.organization) {
        query.organization = req.context.organization.id
    }

    query.status = req.query.status || 'published'

    const ratingCount = db.rating.find(query).count()

    const ratings = db.rating.find(query).limit(pageLmt).skip(fromPage)

    return await Promise.all([ratingCount, ratings]).spread((ratingCount, ratings) => {
        return mapper.toSearchModel(ratings, pageLmt, pageNo, ratingCount)
    })
}

exports.update = async (req) => {
    let log = req.context.logger.start('api:rating:update')

    let ratingModel = await ratingService.getById(req.params.id, req.context)

    let rating = await ratingService.update(req.body, ratingModel, req.context)

    return mapper.toModel(rating)
}
