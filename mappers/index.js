'use strict'
var fs = require('fs')
const paramCase = require('param-case')

var mappers = {}

var init = function () {
    fs.readdirSync(__dirname).forEach(function (file) {
        if (file.indexOf('.js') && file.indexOf('index.js') < 0) {
            var mapper = require('./' + file)

            var name = file.substring(0, file.indexOf('.js'))

            // use toModel as toSummary if one is not defined
            if (!mapper.toSummary) {
                mapper.toSummary = mapper.toModel
            }

            if (!mapper.toListModel) {
                mapper.toListModel = mapper.toSummary
            }

            if (!mapper.toModels) {
                mapper.toModels = function (entities) {
                    var models = []

                    entities.forEach((entity) => {
                        models.push(mapper.toListModel(entity))
                    })

                    return models
                }
            }

            mappers[paramCase(name)] = mapper
        }
    })
}

init()

module.exports = mappers
