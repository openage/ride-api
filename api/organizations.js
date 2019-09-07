var db = require('../models/index')
var mapper = require('../mappers/organization')
var async = require('async')
var updateField = require('../helpers/dbQuery').updateFields
var fs = require('fs')

exports.create = function (req, res) {
    var data = req.body
    if (!data.code) { throw ('code is required') }
    db.organizations.find({
        where: { code: data.code }
    }).then(function (org) {
        if (org) {
            return res.failure('organization already created')
        }
        db.organizations.build({
            name: data.name,
            code: data.code
        }).save().then(function (organization) {
            if (!organization) {
                throw ('could not create organization')
            }
            return res.data(mapper.toModel(organization))
        }).catch((error) => {
            res.failure(error)
        })
    })
}

exports.search = function (req, res) {
    db.organizations.findAll(
    ).then(organization => {
        if (!organization) {
            throw ('no document found')
        }
        return res.data(model.toSearchModel(organization))
    }).catch((error) => {
        res.failure(error)
    })
}
