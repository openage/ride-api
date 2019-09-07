'use strict'

const mongoose = require('mongoose')

module.exports = {
    role: {
        id: String,
        key: String,
        code: String,
        permissions: [{ type: String }],
        organization: { // ems organization details
            id: String,
            name: String,
            code: String
        }
    },
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dob: Date,
    gender: {
        type: String,
        enum: [
            'male', 'female', 'other'
        ]
    },
    picUrl: String,

    rating: {
        rate: { type: Number, default: 0 },
        rateCount: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        oneStar: { type: Number, default: 0 },
        twoStar: { type: Number, default: 0 },
        threeStar: { type: Number, default: 0 },
        fourStar: { type: Number, default: 0 },
        fiveStar: { type: Number, default: 0 }
    },

    spot: { type: mongoose.Schema.Types.ObjectId, ref: 'spot' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' } // vms organization
}
