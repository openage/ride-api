'use strict'

const vehicleService = require('../services/vehicles')
const tripService = require('../services/trips')

exports.canCreate = async (req) => {
    if (!req.body.vehicle || !req.body.vehicle.id) { return 'vehicle required' }

    let vehicle = await vehicleService.getById(req.body.vehicle.id, req.context)

    // if (vehicle.status !== 'available') { return 'vehicle already booked' }

    req.body.origin = await tripService.locality(req.body.origin, req.context)

    if (req.body.destination && req.body.destination.coordinates.length === 2) {
        req.body.destination = await tripService.locality(req.body.destination, req.context)
    }
}

exports.canUpdate = async (req) => {

    // todo
}
