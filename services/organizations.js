'use strict'

const updateScheme = require('../helpers/updateEntities')

const create = async (model, context) => {
    context.logger.start('services/organization:create')

    return await new db.organization(model).save()
}

const getByCode = async (code, context) => {
    context.logger.start('services/organizations:getByCode')

    return await db.organization.findOne({ code: code })
}

const getById = async (id, context) => {
    context.logger.start('services/organizations:getById')

    return await db.organization.findById(id)
}

const getOrCreate = async (data, context) => {
    context.logger.start('services/organizations:getOrCreate')

    let organization = data.id ? await getById(data.id, context) : await getByCode(data.code, context)

    if (organization) { return organization }

    return await create(data, context)
}

const update = async (data, organizationId, context) => {
    let log = context.logger.start('services:organizations:update')

    let model = {
        code: data.code,
        name: data.name,
        shortName: data.shortName,
        type: data.type,
        address: data.address,
        status: data.status
    }

    let organization = await db.organization.findById(organizationId)

    return updateScheme.update(model, organization).save()
} 


exports.getByCode = getByCode
exports.getById = getById
exports.getOrCreate = getOrCreate
exports.create = create
exports.update = update
