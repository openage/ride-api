'use strict'

let updationScheme = require('../helpers/updateEntities')
const rolesProvider = require('../providers/ems/roles')
const organizationService = require('./organizations')
const logger = require('@open-age/logger')('services.driver')

const mapToDriverModel = async (data, context) => {
    context.logger.start('services/drivers:cloneDriver')

    let driverModel = {
        role: {
            id: data.role.id,
            key: data.role.key,
            permissions: data.role.permissions
        },

        code: data.code,
        phone: data.phone,
        email: data.email,
        profile: data.profile,
        status: data.status,
        address: data.address
    }

    let organization = await organizationService.getOrCreate({
        code: role.organization.code,
        address: role.organization.address
    }, context)

    model.organization = organization.id || organization._id.toString()

    return model
}

const create = async (model, context) => {
    context.logger.start('services/drivers:create')

    if (!model.organization) {
        model.organization = context.organization.id
    }

    return new db.driver(model).save()
}

const createByEmpCode = async (roleKey, roleId, context) => { // empCode of employee from ed
    context.logger.start('services/drivers:createByRoleId')

    let role = await rolesProvider.getRole(roleKey, roleId)

    let driverModel = await mapToDriverModel(role, context)

    return create(driverModel, context)
}

const getByCode = async (code, context) => {
    context.logger.start('services/drivers: get')

    let query = {
        code: code,
        organization: context.organization.id || context.organization.toString()
    }

    return db.driver.findOne(query)
}

const getById = async (id, context) => {
    context.logger.start('services/drivers:getById')

    return db.driver.findById(id)
}

const getByModel = async (model, context) => {
    context.logger.start('services/drivers:getByModel')

    return model.id ? db.driver.findById(model.id)
        : db.driver.findOne({ code: model.code, organization: context.organization })
}

const syncDriver = async (model, context) => {
    logger.start('services/drivers: syncDriver')

    if (!model) {
        return null
    }

    if (model.employee.type !== 'driver') {
        logger.info('employee is not driver')
        return null
    }

    if (model.employee && model.role) {
        model.employee.role = model.role
        model = model.employee
    }

    let driver = await db.driver.findOne({
        organization: context.organization,
        'role.id': model.role.id
    })

    if (!driver) {
        driver = await new db.driver({
            _id: toObjectId(model.id || model._id.toString()),
            role: {
                id: model.role.id,
                key: model.role.key,
                permissions: model.role.permissions
            },
            status: model.status,
            organization: context.organization.id || context.organization._id.toString()
        }).save()
    }

    // update attribute

    driver.role = model.role || {}
    driver.role.id = model.role.id
    driver.role.key = model.role.key
    driver.role.permissions = model.role.permissions || []

    driver.email = model.email
    driver.phone = model.phone
    driver.profile = model.profile
    driver.address = model.address
    driver.status = model.status
    await driver.save()

    return driver
}

const update = async (model, driver, context) => {
    context.logger.start('services/drivers:update')

    return updationScheme.update(model, driver).save()
}

exports.create = create
exports.getByCode = getByCode
exports.getByModel = getByModel
exports.getById = getById
exports.syncDriver = syncDriver
exports.update = update
