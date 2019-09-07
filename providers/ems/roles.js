'use strict'

let Client = require('node-rest-client-promise').Client
let client = new Client()
let db = require('../../models')
const logger = require('@open-age/logger')('providers/ems/roles')
let emsConfig = require('config').get('providers.ed')
const organizationService = require('../../services/organizations')
const imageService = require('../../services/images')

const clonePassenger = async (role) => { // create passenger and organization if not exist
    let log = logger.start('clonePassenger')

    let organization = null

    let passengerModel = {
        role: {
            id: role.id,
            key: role.key,
            code: role.code,
            permissions: role.permissions
        },
        email: role.employee ? role.employee.email : role.user.email,
        phone: role.employee ? role.employee.phone : role.user.phone,
        profile: role.employee ? role.employee.profile : role.user.profile || {},
        address: role.employee ? role.employee.address : null
    }

    if (role.user.picUrl) {
        let pic = {
            url: role.user.picUrl,
            thumbnail: await imageService.thumbnailFromUrl(role.user.picUrl)
        }
        passengerModel.profile.pic = pic
    }

    if (role.organization && role.employee) {
        let orgModel = {
            _id: toObjectId(role.organization.id),
            code: role.organization.code,
            name: role.organization.name,
            shortName: role.organization.shortName,
            type: role.organization.type,
            status: role.organization.status,
            address: role.organization.address
        }
        organization = await organizationService.getOrCreate(orgModel, { logger: logger })
        passengerModel.organization = organization.id || organization._id.toString()
    }

    let passenger = await db.passenger.findOrCreate({ 'role.id': role.id }, passengerModel)

    if (passenger.result.role.key !== role.key) {
        passenger.result.role.key = role.key
        await passenger.result.save()
    }

    log.end()

    return {
        passenger: passenger.result,
        organization: organization
    }
}

const cloneDriver = async (role) => { // create driver and organization if not exist
    const log = logger.start('cloneDriver')

    let organization = null

    if (!role.employee || !role.organization) {
        return null
    }

    let isAdmin = (role.organization.owner.id ||
        role.organization.owner.toString()) === role.id

    if (!isAdmin && (role.employee.type !== 'driver')) {
        return null
    }

    let driverModel = {
        _id: toObjectId(role.employee.id || role.employee._id.toString()),

        role: {
            id: role.id,
            key: role.key,
            permissions: role.permissions
        },

        isAdmin: isAdmin,
        email: role.employee.email || role.user.email,
        phone: role.employee.phone || role.user.phone,
        profile:  role.employee.profile || role.user.profile || {},
        address:  role.employee.address || null,
        status: role.employee.status
    }

    if (role.user.picUrl) {
        let pic = {
            url: role.user.picUrl,
            thumbnail: await imageService.thumbnailFromUrl(role.user.picUrl)
        }
        driverModel.profile.pic = pic
    }

    if (role.organization && role.employee) {
        let orgModel = {
            _id: toObjectId(role.organization.id),
            code: role.organization.code,
            name: role.organization.name,
            shortName: role.organization.shortName,
            type: role.organization.type,
            status: role.organization.status,
            address: role.organization.address
        }
        organization = await organizationService.getOrCreate(orgModel, { logger: logger })
        driverModel.organization = organization.id || organization._id.toString()
    }

    let driver = await db.driver.findOrCreate({ 'role.id': role.id }, driverModel)

    if (isAdmin) {
        organization.owner = driver.result || driver.result._id.toString()
        await organization.save()
    }

    if (driver.result.role.key !== role.key) {
        driver.result.role.key = role.key
        await driver.result.save()
    }

    log.end()
    return {
        driver: driver.result,
        organization: organization
    }
}

const getRole = (roleKey, roleId) => { // Get role from employee dictatory
    let log = logger.start('getRole')

    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': roleKey
        }
    }

    let id = roleId || 'my'
    // let url = `http://localhost:3035/api/roles/${id}`;

    let url = `${emsConfig.url}/api/roles/${id}`
    return new Promise((resolve, reject) => {
        return client.getPromise(url, args).then((response) => {
            if (!response || !response.data.isSuccess) {
                log.error(response)
                return reject(new Error('error'))
            }
            log.info('role from ems', response.data.data)
            log.end()
            return resolve(response.data.data)
        })
    })
}

exports.getRole = getRole
exports.clonePassenger = clonePassenger
exports.cloneDriver = cloneDriver
