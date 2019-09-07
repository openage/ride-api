'use strict'

const logger = require('@open-age/logger')('helpers/auth')
const contextBuilder = require('./context-builder')
var async = require('async')
const roles = require('../providers/ems/roles')
const employeeProvider = require('..//providers/ems/employees')
const driverService = require('../services/drivers')
const organizationService = require('../services/organizations')
const db = require('../models')

const fetch = (req, modelName, paramName) => {
    var value = req.query[`${modelName}-${paramName}`] || req.headers[`x-${modelName}-${paramName}`]
    if (!value && req.body[modelName]) {
        value = req.body[modelName][paramName]
    }
    if (!value) {
        return null
    }

    var model = {}
    model[paramName] = value
    return model
}

const extractDriver = async (roleKey) => {
    logger.start('extractDriver')

    let organization = null
    let driver = await db.driver.findOne({ 'role.key': roleKey }).populate('organization')

    if (driver) {
        organization = await organizationService.getById(
            driver.organization.id || driver.organization._id.toString(), { logger: logger })
        return {
            driver: driver,
            organization: organization
        }
    }

    logger.debug('key does not exit, checking with ed')

    let role = await roles.getRole(roleKey)

    if (!role) {
        throw new Error('invalid role key')
    }

    return roles.cloneDriver(role)

    // organization = await organizationService.getOrCreate(model.organization, { logger: logger })
    // model.organization = organization.id
    // driver = await driverService.create(model, { logger: logger, organization: organization })

    // return {
    //     driver: driver,
    //     organization: organization
    // }
}

const extractPassenger = async (roleKey) => {
    let log = logger.start('extractPassenger')

    let organization = null
    let passenger = await db.passenger.findOne({ 'role.key': roleKey }).populate('organization')

    if (passenger) {
        if (passenger.organization) {
            organization = await organizationService.getById(passenger.organization.id, { logger: logger })
        }
        return {
            passenger: passenger,
            organization: organization
        }
    }

    log.debug('key does not exit, checking with ed')

    let role = await roles.getRole(roleKey)

    if (!role) {
        throw new Error('invalid role key')
    }

    return roles.clonePassenger(role)
}

const extractPassengerOrDriver = async (roleKey) => {
    let log = logger.start('extractPassengerOrDriver')

    let claims = {}

    let passengerObj = await extractPassenger(roleKey)
    if (passengerObj) {
        claims.passenger = passengerObj.passenger
        claims.organization = passengerObj.organization
    }

    let driverObj = await extractDriver(roleKey)
    if (driverObj) {
        claims.driver = driverObj.driver
        claims.organization = driverObj.organization
    }
    return claims
}

exports.requiresPassenger = (req, res, next) => {
    let log = logger.start('requiresPassenger')
    var role = fetch(req, 'role', 'key')

    if (!role) {
        return res.accessDenied('x-role-key is required.', 403)
    }

    extractPassenger(role.key).then((claims) => {
        let context = contextBuilder.create(claims, res.logger)
        if (!context) {
            log.error('context could not be created')
            return res.accessDenied('invalid user', 403)
        }
        context.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        req.context = context
        req.context.logger = res.logger
        log.end()
        next()
    }).catch((err) => {
        log.error(err)
        log.end()
        res.accessDenied('invalid user', 403)
    })
}

exports.requiresAdmin = (req, res, next) => {
    let log = logger.start('requiresAdmin')
    var role = fetch(req, 'role', 'key')

    if (!role) {
        return res.accessDenied('x-role-key is required.', 403)
    }

    extractDriver(role.key).then((claims) => {
        let context = contextBuilder.create(claims, res.logger)
        if (!context) {
            log.error('context could not be created')
            log.end()
            return res.accessDenied('invalid user', 403)
        }

        if (!context.hasPermission('admin')) {
            return res.accessDenied('invalid admin', 403)
        }

        context.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        req.context = context
        req.context.logger = res.logger
        log.end()
        next()
    }).catch((err) => {
        log.error(err)
        log.end()
        res.accessDenied('invalid user', 403)
    })
}

exports.requiresDriver = (req, res, next) => {
    let log = logger.start('requiresDriver')
    var role = fetch(req, 'role', 'key')

    if (!role) {
        log.end()
        return res.accessDenied('x-role-key is required.', 403)
    }

    extractDriver(role.key).then((claims) => {
        let context = contextBuilder.create(claims, res.logger)
        if (!context) {
            log.error('context could not be created')
            return res.accessDenied('invalid user', 403)
        }
        context.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        req.context = context
        req.context.logger = res.logger
        next()
    }).catch((err) => {
        log.error(err)
        log.end()
        res.accessDenied('invalid user', 403)
    })
}

exports.requiresPassengerOrDriver = (req, res, next) => {
    let log = logger.start('requiresPassengerOrDriver')

    var role = fetch(req, 'role', 'key')

    if (!role) {
        log.end()
        return res.accessDenied('x-role-key is required.', 403)
    }

    extractPassengerOrDriver(role.key).then((claims) => {
        let context = contextBuilder.create(claims, res.logger)
        if (!context) {
            log.error('context could not be created')
            log.end()
            return res.accessDenied('invalid user', 403)
        }
        context.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        req.context = context
        req.context.logger = res.logger
        next()
    }).catch((err) => {
        log.error(err)
        log.end()
        res.accessDenied('invalid user', 403)
    })
}

exports.requiresDeviceKey = (req, res, next) => {
    let log = logger.start('requiresDeviceKey')

    var input = fetch(req, 'device', 'key')

    if (!input) {
        return res.accessDenied('x-device-key is required.', 403)
    }

    db.device.findOne({
        key: input.key
    }).populate('organization driver').then(device => {
        if (!device) {
            log.end()
            return res.accessDenied('invalid device key', 403)
        }
        let context = contextBuilder.create({
            driver: device.driver,
            organization: device.organization
        }, res.logger)
        if (!context) {
            log.error('context could not be created')
            log.end()
            return res.accessDenied('invalid user', 403)
        }
        context.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        context.device = device
        req.context = context
        req.context.logger = res.logger
        next()
    }).catch(err => {
        log.error(err)
        log.end()
        return res.failure(err)
    })
}

