module.exports = [{
    name: 'ratingCreateRes',
    properties: {
        rate: {
            type: 'number'
        },
        title: {
            type: 'string'
        },
        comment: {
            type: 'string'
        },
        status: {
           type: 'string'
        },
        note: {
          type: 'string'
        },
        photos: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        trip: {
            type: 'object',
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
                type: {
                    type: 'string'
                },
                purpose: {
                    type: 'string'
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
                }
            }
        },
        vehicle: {
            type: 'object',
            properties: {
                id: {
                    type: 'string'
                },
                vehicleNo: {
                    type: 'string'
                },
                model: {
                    type: 'string'
                }
            }
        },
        driver: {
            properties: {
                id: {
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
                }
            }
        }
    }
}]
