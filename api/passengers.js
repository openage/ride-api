'use strict'

const mapper = require('../mappers/passenger')
const passengerService = require('../services/passengers')

exports.get = (req) => {
    let logger = req.context.logger.start('get')

    let passenger = passengerService.getById(req.params.id, req.context)

    return mapper.toModel(passenger)
}
