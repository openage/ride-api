'use strict'
const db = require('../../../../models')
const sendIt = require('../../../../providers/sendIt')
const googleMaps = require('../../../../providers/googleMaps')

exports.process = async (data, context) => {
    const trip = await db.trip.findById(data.id).populate('driver vehicle passengers')

    let dropLocation = trip.destination && trip.destination.description
        ? trip.destination.description : 'Not yet defined by customer'

    let passengerPosition = await googleMaps.getDistance(trip.vehicle.location.coordinates, trip.origin.coordinates)

    let passengerDistance = `${passengerPosition.distance} (${passengerPosition.duration})`
    return sendIt.send({
        'x-role-key': trip.driver.role.key,
        id: trip.id || trip._id.toString(),
        pickUp: trip.origin.description,
        drop: dropLocation,
        pickUpDistance: passengerDistance,
        passengerRating: 5
    },
    'notify-driver-on-trip-creation', [{ roleKey: trip.driver.role.key }],
    trip.passengers[0].role.key, ['push']).then((response) => {
        context.logger.info('push delivered')
    })
}
