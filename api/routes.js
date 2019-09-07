var db = require('../models/index')
var mapper = require('../mappers/route')
var async = require('async')
var updateField = require('../helpers/dbQuery').updateFields
var fs = require('fs')

exports.create = function (req, res) {
    var data = req.body
    if (!data.name) { return cb('name is required') }
    db.organizations.find({
        where: { code: req.headers.orgcode }
    }).then(function (org) {
        if (!org) {
            return res.failure('organization Code does not existed')
        }
        db.routes.build({
            name: data.name,
            vehicleId: data.vehicle.id,
            organizationId: org.id,
            userId: data.user.id
        }).save().then(function (routes) {
            if (!routes) {
                return cb('could not create')
            }
            return res.data(mapper.toModel(routes))
        })
    })
}

exports.search = function (req, res) {
    var whereQuery = {}
    var filters = {
        name: req.query.name || ''
    }
    if (filters.name) {
        whereQuery.name = {
            $like: '%' + filters.name + '%'
        }
    }
    db.routes.findAll({
        where: {
            where: whereQuery
        }
    }).then((routes) => {
        if (!routes) {
            throw ('route not found')
        }
        return res.data(mapper.toModel(routes))
    }).catch((error) => {
        res.failure(error)
    })
}
