module.exports = [{
    name: 'tripResModel',
    properties: {
        id: {
            type: 'string'
        },
        from: {
            type: 'date'
        },
        till: {
            type: 'date'
        },
        startTime: {
            type: 'date'
        },
        endTime: {
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
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    }
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
        organization: {
            properties: {
                id: {
                    type: 'string'
                }
            }
        }
    }
}]
