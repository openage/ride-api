'use strict'
let Client = require('node-rest-client-promise').Client
let client = new Client()
const emsConfig = require('config').get('providers.ed')
const logger = require('@open-age/logger')('providers/ems/employees')

const mapToVmsDriver = (empModel) => {
    logger.start('mapToVmsDriver')

    let isAdmin = (empModel.organization.owner.id || empModel.organization.owner._id.toString() ||
        empModel.organization.owner.toString) === empModel.role.id

    if (!isAdmin && (!empModel.designation || empModel.designation.code.toString() !== 'driver')) {
        return null
    }

    let driverModel = {
        role: {
            id: empModel.role.id,
            key: empModel.role.key,
            permissions: empModel.role.permissions
        },

        code: empModel.code,
        phone: empModel.phone,
        email: empModel.email,
        profile: empModel.profile,
        status: empModel.status,
        address: empModel.address
    }

    driverModel.organization = {
        code: empModel.organization.code,
        address: empModel.organization.address
    }

    return driverModel
}

const getByIdOrCode = (identifier, roleKey) => {
    logger.start('getByIdOrCode')

    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': roleKey
        }
    }

    let url = `${emsConfig.url}/api/employees/${identifier}`
    // let url = `http://localhost:3035/api/employees/${identifier}`

    return new Promise((resolve, reject) => {
        return client.get(url, args, (data, response) => {
            if (!data || !data.isSuccess) {
                return reject()
            }
            let vmsModel = mapToVmsDriver(data.data)
            return resolve(vmsModel)
        })
    })
}

exports.getByIdOrCode = getByIdOrCode
