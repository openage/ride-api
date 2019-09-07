'use strict'

exports.toModel = (entity) => {
    var model = {
        id: entity.id,
        purpose: entity.purpose,
        destination: entity.destination,
        origin: entity.origin,
        till: entity.till,
        from: entity.from,
        startTime: entity.startTime, // actual startTime of time of trip
        endTime: entity.endTime, // actual endTime of time of trip
        duration: entity.duration,
        status: entity.status,
        date: entity.date,
        notes: entity.notes
    }

    if (entity.driver) {
        model.driver = entity.driver._doc ? {
            id: entity.driver.id,
            email: entity.driver.email,
            phone: entity.driver.phone,
            profile: entity.driver.profile,
            rating: entity.driver.rating
        } : {
            id: entity.driver.toString()
        }
    }

    if (entity.vehicle) {
        model.vehicle = entity.vehicle._doc ? {
            id: entity.vehicle.id,
            pic: entity.vehicle.pic,
            capacity: entity.vehicle.capacity,
            vehicleNo: entity.vehicle.vehicleNo,
            model: entity.vehicle.model,
            rating: entity.vehicle.rating
        } : {
            id: entity.vehicle.toString()
        }
    }

    if (entity.passengers && entity.passengers.length) {
        model.passengers = entity.passengers.map((passenger) => {
            return passenger._doc ? {
                id: passenger.id,
                email: passenger.email,
                phone: passenger.phone,
                profile: passenger.profile
            } : {
                id: passenger.toString()
            }
        })
    }

    return model
}

exports.toSearchModel = (entities) => {
    return entities.map((entity) => {
        return exports.toModel(entity)
    })
}
