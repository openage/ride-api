'use strict'

let Client = require('node-rest-client-promise').Client
let client = new Client()
const logger = require('@open-age/logger')('providers/ems/organizations')
let emsConfig = require('config').get('providers.ed')

const cloneOrganization = async (data) => {
    let log = logger.start('cloneOrganization')

    let model = {
        _id: toObjectId(data.id),
        code: data.code,
        name: data.name,
        type: data.type,
        address: data.address
    }

    let organization = await db.organization.findOrCreate({ code: data.code }, model)

    organization.isCreated ? log.info('new organization created') : log.info('organization exist')

    return organization.result
}

const get = (code, roleKey) => { // Get organization from employee dictatory
    let log = logger.start('get')

    let args = {
        headers: {
            'content-Type': 'application/json',
            'x-role-key': roleKey
        }
    }

    let url = `http://localhost:3035/api/organizations/${code}`

    // let url = `${emsConfig.url}/api/organizations/${code}`

    return new Promise((resolve, reject) => {
        return client.get(url, args, (data, response) => {
            if (!data && !data.isSuccess) {
                return reject(`organization not found`)
            }
            return resolve(data.data)
        })
    })
}

exports.get = get
exports.cloneOrganization = cloneOrganization
