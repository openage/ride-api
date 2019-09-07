'use strict'

exports.canCreate = async (req) => {
    if (!req.body.rate) { return 'rate value required' }

    if (!req.body.trip || !req.body.trip.id) { return 'trip required' }
}
