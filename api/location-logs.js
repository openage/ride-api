'use strict'
var async = require('async')
var updateField = require('../helpers/dbQuery').updateFields
var db = require('../models')
var moment = require('moment')
const locationConfig = require('config').get('location')
const client = new require('node-rest-client-promise').Client()

const tripService = require('../services/trips')
const locationLogService = require('../services/location-logs')
const mapper = require('../mappers/location-log')
const deviceService = require('../services/devices')

exports.create = async(req) => {
    let logger = req.context.logger.start('create')

    let model = {
        time: req.body.time,
        ipAddress: req.context.ip,
        device: req.body.device.id || req.body.device,
        location: req.body.location,
        message: req.body.message
    }

    let device = await deviceService.getById(id, req.context)

    if (device.vehicle) {
        model.vehicle = device.vehicle._doc ? device.vehicle.id : device.vehicle.toString()
    } else {
        throw new Error('device is not attached with vehicle')
    }

    // if(device.vehicle.currentTrip) {   //todo

    // }

    // if(req.body.trip) {
    //     model.trip = req.body.trip.id
    // }

    // if(req.body.trip && !req.body.vehicle) {
    //     let trip = await tripService.getById(req.body.trip.id, req.context)
    //     model.vehicle = trip.vehicle._doc ? trip.vehicle.id : trip.vehicle.toString()
    //     model.driver = trip.driver._doc ? trip.driver.id : trip.driver.toString()
    // } else {
    //     model.vehicle = req.body.vehicle.id
    //     model.driver = req.body.driver ? req.body.driver.id : undefined
    // }

    let locationLog = await locationLogService.create(model, req.context)

    logger.end()
    return mapper.toModel(locationLog)
}

exports.get = async(req) => {
    let logger = req.context.logger.start('get')

    let locationLog = await locationLogService.getById(req.params.id, req.context)
    logger.end()
    return mapper.toModel(locationLog)
}
