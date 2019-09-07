'use strict'
const updateScheme = require('../helpers/updateEntities')
const vehicleService = require('../services/vehicles')
const drivers = require('../services/drivers')

const getById = async (id, context) => {
    context.logger.start('services/devices:getById')

    return db.device.findById(id).populate({
        path: vehicle,
        populate: {
            path: currentTrip
        }
    })
}

const update = async (model, device, context) => {
    context.logger.start('services/devices:update')

    if (model.key) {
        device.key = model.key
    }

    if (model.type) {
        device.type = model.type
    }

    if (model.status) {
        device.status = model.status
    }

    if (model.vehicle) {
        device.vehicle = await vehicleService.get(model.vehicle)
    }

    if (model.driver) {
        device.driver = await drivers.getByModel(model.driver)
    }

    return device.save()
}

const create = async (model, context) => {
    context.logger.start('services/devices:create')

    let entity = {}

    if (model.key) {
        entity.key = model.key
    }

    if (model.type) {
        entity.type = model.type
    }

    if (model.vehicle) {
        entity.vehicle = await vehicleService.get(model.vehicle)
    }

    if (model.driver) {
        entity.driver = await drivers.getByModel(model.driver)
    }

    entity.organization = context.organization

    let device = await (new db.device(entity)).save()

    if (entity.vehicle) {
        entity.vehicle = device
        await entity.vehicle.save()
    }

    return device
}

const get = async (query, context) => {
    context.logger.start('services:devices:get')

    if (typeof query === 'string') {
        if (query.toObjectId()) {
            return db.device.findById(query)
        } else {
            return db.device.findOne({ key: query })
        }
    } 

    if (query.id) {
        return db.device.findById(query.id)
    }

    if (query.key) {
        return db.device.findOne(query.key)
    }

    return null
}



exports.getById = getById
exports.update = update
exports.create = create
