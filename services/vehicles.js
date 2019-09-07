'use strict'

var db = require('../models/index')
let updationScheme = require('../helpers/updateEntities')
const googleMaps = require('../providers/googleMaps')
const firebaseVehicles = require('../providers/firebase/vehicles')
const deviceService = require('../services/devices')
const imageService = require('./images')

const createToFirebase = async (vehicle, context) => {
    context.logger.start('services/vehicles:createToFirebase')
    let model = {
        status: vehicle.status,
        location: {
            0: vehicle.location.coordinates[0],
            1: vehicle.location.coordinates[1]
        }
    }

    return await firebaseVehicles.create(model, vehicle.id, context)
}

const updateToFirebase = async (vehicle, context) => {
    context.logger.start('services/vehicles:updateToFirebase')
    let model = {
        status: vehicle.status,
        location: {
            0: vehicle.location.coordinates[0],
            1: vehicle.location.coordinates[1]
        }
    }

    return await firebaseVehicles.update(model, vehicle.id, context)
}

const create = async (data, context) => {
    let logger = context.logger.start('services/vehicle:create')

    let model = data

    if (data.driver && data.driver.id) {
        model.driver = data.driver.id
    }

    if (data.pic && data.pic.url) {
        model.pic.data = imageService.thumbnailFromUrl(data.pic.url)
    }

    if (!data.owner) {
        model.owner = context.driver.id
    }

    if (!data.organization) {
        model.organization = context.organization.id
    }

    let vehicle = await new db.vehicle(model).save()

    // if(model.device) {
    //     await deviceService.updateVehicleAndDevice(vehicle.id, model.device, context)
    // }

    await createToFirebase(vehicle, context)

    return vehicle
}

const update = async (data, vehicle, context) => {
    let logger = context.logger.start('services/vehicle:update')

    let model = data
    if (data.location && data.location.coordinates.length === 2) {
        model.location = data.location
    }

    if (data.pic && data.pic.url) {
        model.pic.data = await imageService.thumbnailFromUrl(model.pic.url)
    }

    if (data.driver && data.driver.id) {
        model.driver = data.driver.id
    }

    let updatedVehicle = await updationScheme.update(model, vehicle).save()

    if (model.location && model.location.coordinates.length === 2) {
        await updateToFirebase(updatedVehicle, context)
    }

    return vehicle
}

const getByVehicleNo = async (vehicleNo, context) => {
    let logger = context.logger.start('services/vehicle: getByVehicle')

    return db.vehicle.findOne({ vehicleNo: vehicleNo, organization: context.organization.id })
}

const getById = async (vehicleId, context) => {
    let logger = context.logger.start('services/vehicle: getById')

    return await db.vehicle.findById(vehicleId).populate('driver organization device')
}

const sortByDuration = vehicleList => {
    vehicleList = vehicleList.sort((vehicleA, vehicleB) => {
        let durationA = isNaN(vehicleA.duration) ? Number(vehicleA.duration.match(/\d/g).join('')) : vehicleA.duration
        let durationB = isNaN(vehicleB.duration) ? Number(vehicleB.duration.match(/\d/g).join('')) : vehicleB.duration

        return durationA - durationB
    })
    return vehicleList
}

const nearToUser = (userCoordinates, vehicles) => {
    const vehiclesList = []
    return Promise.each(vehicles, vehicle => {
        // logger.debug('fetching nearby vehicles list')
        if (vehicle.location.coordinates && vehicle.location.coordinates.length === 2) {
            return googleMaps.getDistance(userCoordinates, vehicle.location.coordinates)
                .then((routeDetails) => {
                    vehicle.distance = routeDetails.distance
                    vehicle.duration = routeDetails.duration
                    vehiclesList.push(vehicle)
                })
        }
    }).then(() => {
        // logger.debug('sorting vehicles list')
        return sortByDuration(vehiclesList)
    })
}

const search = async (searchQuery, context) => {
    let logger = context.logger.start('services/vehicles:search')

    let query = {}

    if (searchQuery.vehicleNo) { query.vehicleNo = searchQuery.vehicleNo }

    if (searchQuery.capacity) { query.capacity = searchQuery.capacity }

    if (searchQuery.status) {
        query.status = searchQuery.status
    }

    if (context.driver && context.organization) {
        // driver/employee should not be able to see vehicles from other organizations
        query.organization = context.organization
    }

    if (context.passenger && !context.driver) {
        // passenger should be able to search only those vehicles which are available
        query.status = 'available'
        query.driver = { $exists: true }
    }

    if (!searchQuery.longitude && !searchQuery.latitude) {
        return db.vehicle.find(query).populate('organization')
    }

    query['location.coordinates'] = {
        $near: {
            $geometry: {
                type: 'Point',
                coordinates: [searchQuery.longitude, searchQuery.latitude]
            }
        }
    }

    return db.vehicle.find(query).populate('organization')

    // let coordinates = [searchQuery.longitude, searchQuery.latitude]
    // vehicles = await nearToUser(coordinates, vehicles)
    // return vehicles
}

exports.get = async (query, context) => {
    context.logger.start('get')
    if (typeof query === 'string') {
        if (query.isObjectId()) {
            return db.vehicle.findById(query).populate('organization')
        } else {
            return db.vehicle.findOne({
                vehicleNo: query,
                organization: context.organization.id
            }).populate('organization')
        }
    }
    if (query.id) {
        return db.vehicle.findById(query.id)
    }

    if (query.code || query.vehicleNo) {
        return await db.vehicle.findOne({
            vehicleNo: query.code || query.vehicleNo,
            organization: context.organization.id
        })
    }

    return null
}

exports.find = (data) => {
    return db.vehicle.find({
        where: {
            vehicleNo: data.vehicleNo
        }
    }).then(function (vehicle) {
        if (vehicle) {
            return vehicle
        }
        db.vehicle.build({
            vehicleNo: data.vehicleNo,
            type: data.type,
            availability: 'available',
            picUrl: data.picUrl,
            capacity: data.capacity,
            employeeId: data.employeeId
        }).save().then(function (vehicle) {
            return vehicle
        })
    })
}

exports.create = create
exports.search = search
exports.getById = getById
exports.getByVehicleNo = getByVehicleNo
exports.update = update
