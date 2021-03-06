'use strict'
const sendItConfig = require('config').get('providers.sendIt.url')
const logger = require('@open-age/logger')('providers/sendIt')
const client = new (require('node-rest-client-promise')).Client()

exports.send = async (data, templateCode, to, from, modes, options) => {
    logger.start('sending message')

    var args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': from // role key here
        },
        data: {
            'template': {
                'code': templateCode
            },
            'to': to, // Array of objects
            'data': data,
            'modes': modes, // list of modes
            'options': options
        }
    }

    let url = `${sendItConfig}/api/messages`

    return client.postPromise(url, args)
        .then((data) => {
            if (!data.data.isSuccess) {
                throw new Error(`invalid response from send-it`)
            }
            return Promise.resolve(data.data)
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}
