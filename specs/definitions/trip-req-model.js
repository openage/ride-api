module.exports = [{
    name: 'tripReqModel',
    properties: {
        from: {
            type: 'date'
        },
        till: {
            type: 'date'
        },
        type: {
            type: 'string'
        },
        purpose: {
            type: 'string'
        },
        route: {
            properties: {
                type: {
                    id: 'string'
                }
            }
        },
        origin: {
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
        destination: {
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
        duration: {
            type: 'number'
        },
        notes: {
            type: 'array',
            items: {
                properties: {
                    text: {
                        type: 'string'
                    },
                    date: {
                        type: 'date'
                    }
                }
            }
        },
        vehicle: {
            properties: {
                id: {
                    type: 'string'
                }
            }
        },
        passengers: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        driver: {
            properties: {
                id: {
                    type: 'string'
                }
            }
        }
    }
}]
