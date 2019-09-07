'use strict'

const mongoose = require('mongoose')

module.exports = {
    // visible: DataTypes.BOOLEAN, //todo
    date: Date,
    name: String, // Rc
    number: String, // regn. no or doc
    issueOn: Date,
    expireOn: Date, // valid upto
    image: { // documentPath
        data: String,
        url: String
    }, // documentImage url
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'vehicle' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' },

    isArchive: Boolean
}
