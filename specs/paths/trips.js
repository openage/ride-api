module.exports = [{
    url: '/',
    post: {
        description: 'create trip',
        parameters: [{
            name: 'body',
            in: 'body',
            description: 'trip details',
            schema: {
                $ref: '#/definitions/tripReqModel'
            }
        }, {
            name: 'x-role-key',
            in: 'header',
            description: 'Role-key (ED)',
            required: true
        }],
        responses: {
            default: {
                description: 'Unexpected error',
                schema: {
                    $ref: '#/definitions/tripResModel'
                }
            }
        }
    },
    get: {
        description: 'search trips',
        parameters: [{
            name: 'status',
            in: 'query',
            description: 'trips status',
            required: false,
            type: 'string'
        }, {
            name: 'vehicleId',
            in: 'query',
            description: 'vehicle id',
            required: false,
            type: 'string'
        }, {
            name: 'driverId',
            in: 'query',
            description: 'driver id',
            required: false,
            type: 'string'

        }, {
            name: 'date',
            in: 'query',
            description: 'date of trip',
            required: false,
            type: 'number'
        }, {
            name: 'pageNo',
            in: 'query',
            description: 'send in number',
            required: false,
            type: 'number'
        }, {
            name: 'pageSize',
            in: 'query',
            description: 'send in number',
            required: false,
            type: 'number'
        }, {
            name: 'x-role-key',
            in: 'header',
            description: 'Role-key (ED)',
            required: true
        }],
        responses: {
            default: {
                description: 'Unexpected error',
                schema: {
                    $ref: '#/definitions/tripResModel'
                }
            }
        }
    }
}, {
    url: '/{id}',
    get: {
        description: 'get trip by id',
        parameters: [{
            name: 'id',
            in: 'path',
            description: 'trip id',
            required: true
        }, {
            name: 'x-role-key',
            in: 'header',
            description: 'Role-key (ED)',
            required: true
        }],
        responses: {
            default: {
                description: 'Unexpected error',
                schema: {
                    $ref: '#/definitions/tripGetRes'
                }
            }
        }
    },
    put: {
        description: 'update trip details',
        parameters: [{
            name: 'body',
            in: 'body',
            description: 'trip Details',
            required: true,
            schema: {
                $ref: '#/definitions/tripUpdateModel'
            }
        }, {
            name: 'id',
            in: 'path',
            description: 'trip id',
            required: true
        }, {
            name: 'x-role-key',
            in: 'header',
            description: 'Role-key (ED)',
            required: true
        }],
        responses: {
            default: {
                description: 'Unexpected error',
                schema: {
                    $ref: '#/definitions/tripResModel'
                }
            }
        }
    }
}, {
    url: '/{id}/status',
    put: {
        description: 'update trip status',
        parameters: [{
            name: 'body',
            in: 'body',
            description: 'trip status with details',
            schema: {
                $ref: '#/definitions/updateTripStatus'
            }
        }, {
            name: 'id',
            in: 'path',
            description: 'trip id',
            required: true
        }, {
            name: 'x-role-key',
            in: 'header',
            description: 'Role-key (ED)',
            required: true
        }],
        responses: {
            default: {
                description: 'Unexpected error',
                schema: {
                    $ref: '#/definitions/tripResModel'
                }
            }
        }
    }
}]
