'use strict'

var mapper = require('../mappers').device
const devices = require('../services/devices')

exports.create = async (req) => {
    let device = await devices.create(req.body, req.context)
    return mapper.toModel(device)
}

exports.get = async (req) => {
    let device = await devices.getById(req.params.id, req.context)
    return mapper.toModel(device)
}

exports.search = async (req) => {
    let entities = await devices.getById(req.query, req.context)
    return mapper.toModels(entities)
}
