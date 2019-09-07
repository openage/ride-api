'use strict'

const vehicleService = require('../services/vehicles')
const driverService = require('../services/drivers')
const deviceService = require('../services/devices')
const mapper = require('../mappers/vehicle')
const employeeProvider = require('../providers/ems/employees')
const imageService = require('../services/images')

exports.create = async (req) => {
    let logger = req.context.logger.start('create')
    // if (req.body.device) {    //todo
    //     model.device = req.body.device.id
    // }
    let vehicle = await vehicleService.create(req.body, req.context)

    return mapper.toModel(vehicle)
}

exports.get = async (req) => {
    let logger = req.context.logger.start('get')

    let vehicle = await vehicleService.get(req.params.id, req.context)

    return mapper.toModel(vehicle)
}

exports.update = async (req) => {
    let logger = req.context.logger.start('update')

    let vehicle = await vehicleService.getById(req.params.id, req.context)

    let updatedVehicle = await vehicleService.update(req.body, vehicle, req.context)

    return mapper.toModel(updatedVehicle)
}

exports.search = async (req) => {
    let logger = req.context.logger.start('search')

    let vehicles = await vehicleService.search(req.query, req.context)

    return mapper.toSearchModel(vehicles)
}

exports.delete = async (req) => {
    let logger = req.context.logger.start('delete')

    let vehicle = await vehicleService.getById(req.params.id, req.context)

    await vehicleService.update({ status: 'hide' }, vehicle, req.context)

    return 'vehicle removed'
}

// exports.search = async (req) => {
//     let logger = req.context.logger.start('search')

//     let pageNo = Number(req.query.pageNo)
//     let pageSize = Number(req.query.pageSize)
//     let toPage = (pageNo || 1) * (pageSize || 10)
//     let fromPage = toPage - (pageSize || 10)
//     let pageLmt = (pageSize || 10)
//     let query = {}

//     let isNearBy = req.query.longitude && req.query.longitude ? true : false

//     if (req.query.vehicleNo) { query.vehicleNo = req.query.vehicleNo }
//     if (req.query.capacity) { query.capacity = req.query.capacity }
//     if (req.query.status) { query.status = req.query.status }
//     if (req.query.organization) { query.organization = req.context.organization }
//     if (isNearBy) {

//     }

//     const vehiclesCount = db.vehicle.find(query).count()

//     if (!isNearBy) {
//         let vehicles = db.vehicle.find(query).sort({ rating: -1 }).skip(fromPage).limit(pageLmt)
//         return await Promise.all([vehiclesCount, vehicles]).spread((vehiclesCount, vehicles) => {
//             return mapper.toSearchModel(vehicles, pageLmt, pageNo, vehiclesCount)
//         })
//     }

//     let vehicles = db.vehicle.find(query).skip(fromPage).limit(pageLmt)
//     let coordinates = [req.query.longitude, req.query.latitude]

//     return await Promise.all([vehiclesCount, vehicles]).spread((vehiclesCount, vehicles) => {
//         let nearByVehicles = await vehicleService.nearToUser(coordinates, vehicles)
//         return mapper.toSearchModel(nearByVehicles, pageLmt, pageNo, vehiclesCount)
//     })
// }