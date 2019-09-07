'use strict'

const mapper = require('../mappers/driver')
const driverService = require('../services/drivers')
const organizationService = require('../services/organizations')
var db = require('../models')

exports.search = async (req) => {
    let logger = req.context.logger.start('search')

    // TODO: hacked
    let query = {
        //  isAdmin: false,
        // status: req.query.status || 'active'
    }

    if (req.query.organizationCode) {
        let organization = await organizationService.getByCode(req.query.organizationCode, req.context)
        query.organization = organization.id
    }

    if (req.context.organization) {
        query.organization = req.context.organization.id
    }

    let drivers = await db.driver.find(query)

    logger.end()
    return mapper.toSearchModel(drivers)
}

exports.get = async (req) => {
    let logger = req.context.logger.start('get')

    let driver = await driverService.getById(req.params.id, req.context)
    logger.end()

    return mapper.toModel(driver)
}

exports.delete = async (req) => {
    let logger = req.context.logger.start('delete')

    let driver = await driverService.getById(req.params.id, req.context)

    if (driver.isAdmin) {
        throw new Error('driver is admin')
    }

    await driverService.update({ status: 'inactive' }, driver, req.context)

    logger.end()

    return 'driver successfully deleted'
}
