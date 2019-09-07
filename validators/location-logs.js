'use strict'

exports.canCreate = async (req) => {
    if (!req.body.location || req.body.location.coordinates.length !== 2) {
        return 'location required'
    }

    if (req.body.trip && !req.body.trip.id) {
        return 'trip id required'
    }

    if (req.body.vehicle && !req.body.vehicle.id) {
        return 'vehicle id required'
    }

    if (req.body.driver && !req.body.driver.id) {
        return 'driver id required'
    } // validation of ipAddress and time

    if (!req.body.trip && !req.body.vehicle) {
        return 'trip or vehicle required'
    }
}
