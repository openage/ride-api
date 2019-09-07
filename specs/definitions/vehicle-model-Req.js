module.exports = [{
    name: 'vehicleModelReq',
    properties: {
        vehicleNo: {
            type: 'string'
        },
        model: {
            type: 'string'
        },
        type: {
            type: 'string'
        },
        maker: {
            type: 'string'
        },
        capacity: {
            type: 'number'
        },
        odoMeter: {
            type: 'number'
        },
        fuelType: {
            type: 'string'
        },
        fuelEfficiency: {
            type: 'string'
        },
        status: {
            type: 'string'
        },
        category: {
            type: 'string'
        },
        isPublic: {
            type: 'boolean'
        },
        purpose: {
            type: 'string'
        },
        facilities: {
            type: 'string'
        },
        location: {
            type: 'object',
            properties: {
                coordinates: {
                    type: 'array',
                    items: {
                        type: 'integer'
                    }
                }
            }
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
        },

        driver: {
            type: 'object',
            properties: {
                id: {
                    type: 'string'
                }
            }
        },
        device: {
            type: 'object',
            properties: {
                id: {
                    type: 'string'
                }
            }
        }

    }
}]
