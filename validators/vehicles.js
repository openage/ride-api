'use strict'

var uploader = require('../helpers/fileUploader')
const vehicleServices = require('../services/vehicles')
const organizationServices = require('../services/organizations')
const emsOrganization = require('../providers/ems/organizations')

exports.canCreate = async (req) => {
    if (!req.body.location || req.body.location.coordinates.length !== 2) {
        return 'location required'
    }

    if (!req.context.organization) { return 'organization not found' }

    if (!req.body.vehicleNo) { return 'vehicleNo required' }

    let vehicle = await vehicleServices.getByVehicleNo(req.body.vehicleNo, req.context)
    if (vehicle) { return 'vehicleNo exist' }

}

var imageUploader = function (reqUpdate, callback) {
    uploader.withFileForm(reqUpdate, function (err, field, files) {
        if (err) {
            return callback(err)
        }
        if (files.length === 0) {
            return callback('file not found')
        }
        uploader.dataUpload(files.file, function (err, data) {
            if (err) {
                return callback(err)
            }
            if (reqUpdate.query) {
                reqUpdate.query.fileUrl = data.data.url
            }
            if (reqUpdate.body) {
                reqUpdate.body.fileUrl = data.data.url
            }
            return callback(null)
        })
    })
}

exports.canVehicleImages = function (req, callback) {
    imageUploader(req, function (err, imageData) {
        if (err) {
            callback(err)
        }
        callback(null)
    })
}
