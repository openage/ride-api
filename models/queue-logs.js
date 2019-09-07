'use strict'
const mongoose = require('mongoose')
// let findOrCreate = require('findorcreate-promise')

module.exports = {
    entity: String,
    action: String,
    data: Object,
    context: Object
}

// entity.plugin(findOrCreate)
