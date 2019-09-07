'use strict'

exports.canCreate = async (req) => {
    if (!req.body.vehicle && !req.body.vehicle.id) {
        return ('vehicle is required')
    }
    if (!req.body.odoMeter) {
        return ('odoMeter is required')
    }
}
