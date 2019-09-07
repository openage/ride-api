'use strict'

exports.toModel = (entity) => {
    let model = {
        id: entity.id || entity._id.toString(),
        vehicleNo: entity.vehicleNo,
        model: entity.model,
        maker: entity.maker,
        about: entity.about,
        type: entity.type,
        status: entity.status,
        isPublic: entity.isPublic,
        category: entity.category,
        purpose: entity.purpose,
        pic: entity.pic,
        capacity: entity.capacity,
        facilities: entity.facilities,
        fuelEfficiency: entity.fuelEfficiency,
        odoMeter: entity.odoMeter,
        distance: entity.distance,
        duration: entity.duration,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
    }



    if (entity.location) {
        model.location = {
            coordinates: entity.location.coordinates,
            name: entity.location.name,
            description: entity.location.description
        }
    }

    if (entity.rating) {
        let rating = {
            rate: entity.rating.rate || 3.5,
            rateCount: entity.rating.rateCount || 75,
            reviewCount: entity.rating.reviewCount || 100,
            oneStar: entity.rating.oneStar || 12,
            twoStar: entity.rating.twoStar || 18,
            threeStar: entity.rating.threeStar || 15,
            fourStar: entity.rating.fourStar || 15,
            fiveStar: entity.rating.fiveStar || 15
        }

        model.rating = rating
    }

    if (entity.organization) {
        model.organization = entity.organization._doc ? {
            id: entity.organization.id,
            name: entity.organization.name,
            code: entity.organization.code
        } : {
                id: entity.organization.toString()
            }
    }

    if (entity.driver) {
        model.driver = entity.driver._doc ? {
            id: entity.driver.id,
            email: entity.driver.email,
            phone: entity.driver.phone,
            profile: entity.driver.profile
        } : {
                id: entity.driver.toString()
            }
    }

    if (entity.owner) {
        model.owner = entity.owner._doc ? {
            id: entity.owner.id,
            email: entity.owner.email,
            phone: entity.owner.phone,
            profile: entity.driver.profile
        } : {
                id: entity.owner.toString()
            }
    }

    return model
}

exports.toSearchModel = (entities) => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}
