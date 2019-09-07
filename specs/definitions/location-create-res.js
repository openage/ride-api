module.exports = [{
    name: 'locationCreateRes',
    properties: {
        id: {
            type: 'string'
        },
        time: {
            type: 'date'
        },
        ipAddress: {
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
        device: {
            properties: {
                id: {
                    type: 'string'
                }
            }
        },
        message: {
            type: 'string'
        },
        distance: {
            type: 'number'
        },
        duration: {
            type: 'number'
        },
        vehicle: {
            properties: {
                id: {
                    type: 'string'
                }
            }
        },
        driver: {
            properties: {
                id: {
                    type: 'string'
                }
            }
        },
        trip: {
            properties: {
                id: {
                    type: 'string'
                }
            }
        }
    }
}]
