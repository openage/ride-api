'use strict'

const firebaseVehicles = require('../providers/firebase/vehicles')

const create = async (model, context) => {
    context.logger.start('services/locationLogs:create')

    let locationLog = await new db.locationLog(model).save()

    await firebaseVehicles.update({
        location: {
            0: model.location.coordinates[0],
            1: model.location.coordinates[1]
        }
    }, model.vehicle, context) // todo update trip locationLogs

    return locationLog
}

exports.create = create
