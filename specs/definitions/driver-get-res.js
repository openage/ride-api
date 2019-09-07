module.exports = [{
    name: 'driverGetRes',
    properties: {
        id: {
            type: 'string'
        },
        code: {
            type: 'string'
        },
        profile: {
            properties: {
                firstName: {
                    type: 'string'
                },
                lastName: {
                    type: 'string'
                },
                dob: {
                    type: 'date'
                },
                bloodGroup: {
                    type: 'string'
                },
                gender: {
                    type: 'string'
                },
                pic: {
                    properties: {
                        url: {
                            type: 'string'
                        },
                        data: {
                            type: 'string'
                        }
                    }
                }
            }
        },
        rating: {
            type: 'object',
            properties: {
                rate: {
                    type: 'number'
                },
                rateCount: {
                    type: 'number'
                },
                reviewCount: {
                    type: 'number'
                },
                oneStar: {
                    type: 'number'
                },
                twoStar: {
                    type: 'number'
                },
                threeStar: {
                    type: 'number'
                },
                fourStar: {
                    type: 'number'
                },
                fiveStar: {
                    type: 'number'
                }
            }
        }
    }
}]
