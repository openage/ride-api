'use strict'
const fs = require('fs')
const join = require('path').join
const mongoose = require('mongoose')
const changeCase = require('change-case')
const findOrCreate = require('findorcreate-promise')

mongoose.Promise = global.Promise
let init = function () {
    if (global._models_init) {
        return
    }
    mongoose.plugin(findOrCreate)
    // set all the models on db
    fs.readdirSync(__dirname).forEach(function (file) {
        if (file.indexOf('.js') && file.indexOf('index.js') < 0) {
            let name = file.split('.')[0]
            let entity = require('./' + file)
            entity.timeStamp = {
                type: Date,
                default: Date.now
            }
            let schema = mongoose.Schema(entity)

            schema.pre('save', function (next) {
                this.timeStamp = Date.now()
                next()
            })

            mongoose.model(changeCase.camelCase(name), schema)
        }
    })
    global._models_init = true
    global.toObjectId = id => mongoose.Types.ObjectId(id)
}

init()

module.exports = mongoose.models
