'use strict'

const firebase = require('firebase')
const firebaseConfig = require('config').get('firebase')
firebase.initializeApp(firebaseConfig)

const create = (model, vehicleId, context) => {
    let logger = context.logger.start('provider/firebase/vehicles:create')
    let vehicleRef = firebase.database().ref('vehicles')

    vehicleRef.child(vehicleId).set(model)

    vehicleRef.once('value').then((snapshot) => {
        logger.info(snapshot.val())
    }).catch((error) => {
        logger.error('Failed to create vehicle on firebase:', error)
    })
}

const update = (model, vehicleId, context) => {
    let logger = context.logger.start('provider/firebase/vehicles:update')

    let vehicleRef = firebase.database().ref('/vehicles/' + vehicleId)

    vehicleRef.update(model)

    vehicleRef.once('value').then((snapshot) => {
        logger.info(snapshot.val())
    }).catch((error) => {
        logger.error('Failed to update vehicle on firebase:', error)
    })
}

exports.create = create
exports.update = update
