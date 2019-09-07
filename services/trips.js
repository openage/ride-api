'use strict'

const updateScheme = require('../helpers/updateEntities')
const vehicleService = require('./vehicles')
const googleMaps = require('../providers/googleMaps')
const offline = require('@open-age/offline-processor')

const getVehicleStatus = (tripStatus, context) => {
    context.logger.start('services/trips:getVehicleStatus')
    let vehicleStatus = {
        available: 'available',
        booked: 'booked'
    }

    switch (tripStatus) {
        case 'completed':
            return vehicleStatus.available
        case 'started':
            return vehicleStatus.booked
        default:
            null
    }
}

const create = async (data, context) => {
    let logger = context.logger.start('services/trips:create')

    let model = {
        from: data.from,
        till: data.till,
        type: data.type,
        status: 'new',
        purpose: data.purpose,
        origin: data.origin,
        destination: data.destination,
        duration: data.duration,
        vehicle: data.vehicle.id
    }

    if (data.passengers) {
        model.passengers = data.passengers
    } else {
        model.passengers = []
        model.passengers.push(context.passenger.id)
    }

    let vehicle = await vehicleService.getById(data.vehicle.id, context)

    if (data.driver) {
        model.driver = data.driver.id
    } else {
        model.driver = vehicle.driver._doc ? vehicle.driver.id : vehicle.driver.toString()
    }

    if (!model.driver) { throw 'driver not available' }

    model.organization = vehicle.organization._doc ? vehicle.organization.id : vehicle.organization.toString()

    let trip = await new db.trip(model).save()
    context.processSync = true

    await offline.queue('trip', 'create', {
        id: trip.id
    }, context)

    return getById(trip.id, context)
}

const getById = async (id, context) => {
    let logger = context.logger.start('services/trips:getById')

    return await db.trip.findById(id).populate('driver vehicle passengers')
}

const update = async (model, trip, context) => {
    let logger = context.logger.start('services/trips:update')

    let updatedTrip = await updateScheme.update(model, trip).save()

    if (model.status) {
        let vehicleStatus = getVehicleStatus(model.status, context)
        context.processSync = true
        if (vehicleStatus) {
            await vehicleService.update({ status: vehicleStatus }, updatedTrip.vehicle, context)
        }
        await offline.queue('trip', model.status, { id: trip.id }, context)
    }

    return updatedTrip
}

const locality = async (location, context) => {
    context.logger.start('services/trips:location')

    return googleMaps.getLocality(location).then((locationDetails) => {
        return locationDetails
    })
}

exports.getById = getById
exports.create = create
exports.update = update
exports.locality = locality
