'use strict'

exports.toModel = (entity) => {
    let model = {
        id: entity.id || entity._id.toString(),
        rate: entity.rate,
        comment: entity.comment,
        title: entity.title,
        status: entity.status,
        photos: entity.photos
    }

    if (entity.passenger) {
        model.passenger = entity.passenger._doc ? {
            id: entity.passenger.id,
            email: entity.passenger.email,
            phone: entity.passenger.phone,
            profile: entity.passenger.profile
        } : {
                id: entity.passenger.toString()
            }
    }

    if (entity.trip) {
        model.trip = entity.trip._doc ? {
            id: entity.trip.id,
            purpose: entity.trip.purpose,
            designation: entity.trip.designation,
            origin: entity.trip.origin,
            till: entity.trip.till,
            from: entity.trip.from,
            startTime: entity.trip.startTime,
            endTime: entity.trip.endTime,
            duration: entity.trip.duration,
            status: entity.trip.status,
            date: entity.trip.date,
            notes: entity.trip.notes
          
        } : {
                id: entity.trip.toString()
            }
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

    return model
}

exports.toSearchModel = entities => {
    return entities.map((entity) => {
        return exports.toModel(entity)
    })
}