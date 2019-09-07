module.exports = [{
    name: 'tripGetRes',
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
                },
                capacity: {
                    type: 'string'
                },
                vehicleNo: {
                    type: 'string'
                },
                model: {
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
        passengers: {
            type: 'array',
            items: {
                type: 'object',
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
