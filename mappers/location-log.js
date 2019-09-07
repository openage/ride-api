'use strict'
exports.toModel = function (entity) {
    var model = {
        id: entity.id || entity._id.toString(),
        location: entity.location,
        time: entity.time,
        distance: entity.distance,
        duration: entity.duration
    }

    if (entity.trip) {
        model.trip = entity.trip._doc ? {
            id: entity.trip.id,
            purpose: entity.trip.purpose,
            destination: entity.trip.destination,
            origin: entity.trip.origin,
            till: entity.trip.till,
            from: entity.trip.from,
            startTime: entity.trip.startTime, // actual startTime of time of trip
            endTime: entity.trip.endTime, // actual endTime of time of trip
            duration: entity.trip.duration
        } : {
            id: entity.trip.toString()
        }
    }

    if (entity.vehicle) {
        model.vehicle = entity.vehicle._doc ? {
            id: entity.vehicle.id,
            vehicleNo: entity.vehicle.vehicleNo,
            model: entity.vehicle.model,
            type: entity.vehicle.type,
            status: entity.vehicle.status,
            isPublic: entity.vehicle.isPublic,
            category: entity.vehicle.category,
            purpose: entity.vehicle.purpose,
            pic: entity.vehicle.pic
        } : {
            id: entity.vehicle.toString()
        }
    }
    return model
}
exports.toSearchModel = (entities) => {
    entities.map((entity) => {
        return exports.toModel(entity)
    })
}
