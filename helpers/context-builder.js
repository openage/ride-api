'use strict'
const logger = require('@open-age/logger')('helpers/context-builder')
const paramCase = require('param-case')

exports.create = (claims, logger) => {
    let context = {
        logger: logger || claims.logger,
        passenger: claims.passenger,
        driver: claims.driver,
        organization: claims.organization
    }

    let log = context.logger.start('context-builder:create')

    context.log = context.logger

    context.permissions = context.driver && context.driver.role.permissions
        ? context.driver.role.permissions : []

    context.hasPermission = (permission) => {
        return context.permissions.find(element => element === permission)
    }

    context.where = () => {
        let clause = {}

        if (context.organization) {
            clause.organization = context.organization.id.toObjectId()
        }

        let filters = {}

        filters.add = (field, value) => {
            if (value) {
                clause[field] = value
            }
            return filters
        }

        filters.clause = clause

        return filters
    }

    log.end()
    return context
}

exports.serializer = async (context) => {
    let serialized = {}

    if (context.passenger) {
        serialized.passengerId = context.passenger.id
    }

    if (context.driver) {
        serialized.driverId = context.driver.id
    }

    if (context.organization) {
        serialized.organizationId = context.organization._doc ? context.organization.id : context.organization.toString()
    }

    return serialized
}

exports.deserializer = (claims, logger) => {
    let obj = {}

    if (claims.passengerId) {
        obj.passenger = {
            id: claims.passengerId
        }
    }
    if (claims.driverId) {
        obj.driver = {
            id: claims.driverId
        }
    }

    if (claims.organizationId) {
        obj.organization = {
            id: claims.organizationId
        }
    }

    return create(claims, logger)
}
