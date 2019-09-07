'use strict'

const mongoose = require('mongoose')

module.exports = {
    role: {
        id: String,
        key: String,
        code: String,
        permissions: [{ type: String }]
    },

    code: String,
    email: String,
    phone: String,
    profile: {
        firstName: String,
        lastName: String,
        pic: {
            url: String,
            thumbnail: String
        },
        dob: {
            type: Date,
            default: null
        },
        fatherName: String,
        bloodGroup: String,
        gender: {
            type: String,
            enum: ['male', 'female', 'other']
        }
    },

    status: {
        type: String,
        enum: [ 'active', 'inactive']
    },

    address: {
        line1: String,
        line2: String,
        district: String,
        city: String,
        state: String,
        pinCode: String,
        country: String
    },

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
