'use strict'

const queueLogService = require('../services/queue-logs')
const offline = require('@open-age/offline-processor')

exports.createDriver = async (req) => { // used by ems
    const log = req.context.logger.start('create')
    req.context.processSync = true

    const queueLogModel = {
        entity: 'driver',
        action: 'sync',
        data: req.body,
        context: req.context
    }

    const queueLog = await queueLogService.create(queueLogModel, req.context)

    offline.queue('queueLog', 'create', { id: queueLog.id }, req.context)
    log.end()

    return 'driver created'
}

exports.updateDriver = async (req) => {
    const log = req.context.logger.start('update')
    req.context.processSync = true

    const queueLogModel = {
        entity: 'driver',
        action: 'sync',
        data: req.body,
        context: req.context
    }

    const queueLog = await queueLogService.create(queueLogModel, req.context)

    offline.queue('queueLog', 'create', { id: queueLog.id }, req.context)
    log.end()

    return 'driver updated'
}

exports.organizationUpdate = async (req) => {
    let log = req.context.logger.start('api:hooks:organizationUpdate')

    req.context.processSync = true

    let queueLogModel = {
        entity: 'organization',
        action: 'sync',
        data: req.body,
        context: req.context
    }

    const queueLog = await queueLogService.create(queueLogModel, req.context)

    offline.queue('queueLog', 'create', { id: queueLog.id }, req.context)

    return 'organization update'
}

exports.passengerUpdate = async (req) => {
    let log = req.context.logger.start('api:hooks:passengerUpdate')

    req.context.processSync = true
    
    const queueLogModel = {
        entity : 'passenger',
        action: 'sync',
        data: req.body,
        context: req.context
    }

    const queueLog = await queueLogService.create(queueLogModel, req.context)

    offline.queue('queueLog', 'create', { id: queueLog.id }, req.context)

    return 'organization update'
    
}
