module.exports = [{
    name: 'vehicleGetRes',
    properties: {
        id: {
            type: 'string'
        },
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
        organization: {
            properties: {
                id: {
                    type: 'string'
                },
                code: {
                    type: 'string'
                },
                address: {
                    type: 'object',
                    properties: {
                        line1: {
                            type: 'string'
                        },
                        line2: {
                            type: 'string'
                        },
                        district: {
                            type: 'string'
                        },
                        city: {
                            type: 'string'
                        },
                        state: {
                            type: 'string'
                        },
                        pinCode: {
                            type: 'string'
                        },
                        country: {
                            type: 'string'
                        }
                    }
                }
            }
        },
        driver: {
            type: 'object',
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
        },
        owner: {
            type: 'object',
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
                }
            }
        }

    }
}]
