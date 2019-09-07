module.exports = [{
    url: '/',
    post: {
        description: 'create vehicle',
        parameters: [{
            name: 'body',
            in: 'body',
            description: 'vehicle details',
            schema: {
                $ref: '#/definitions/vehicleModelReq'
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
                    $ref: '#/definitions/vehicleResModel'
                }
            }
        }
    },
    get: {
        description: 'search vehicles',
        parameters: [{
            name: 'longitude',
            in: 'query',
            description: 'user longitude coordinate',
            required: false,
            type: 'string'
        }, {
            name: 'latitude',
            in: 'query',
            description: 'user latitude coordinate',
            required: false,
            type: 'string'
        }, {
            name: 'vehicleNo',
            in: 'query',
            description: 'vehicle no',
            required: false,
            type: 'string'

        }, {
            name: 'capacity',
            in: 'query',
            description: 'passengers capacity of vehicle',
            required: false,
            type: 'number'
        }, {
            name: 'status',
            in: 'query',
            description: 'vehicle status',
            required: false,
            type: 'string'
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
                    $ref: '#/definitions/vehicleGetRes'
                }
            }
        }
    }
}, {
    url: '/{id}',
    delete: {
        description: 'delete vehicle',
        parameters: [{
            name: 'id',
            in: 'path',
            description: 'vehicle id',
            required: true
        }, {
            name: 'x-role-key',
            in: 'header',
            description: 'Role-key (owner)',
            required: true
        }],
        responses: {
            default: {
                description: 'Unexpected error',
                schema: {
                    $ref: '#/definitions/Error'
                }
            }
        }
    },
    get: {
        description: 'get vehicle by id',
        parameters: [{
            name: 'id',
            in: 'path',
            description: 'vehicle id',
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
                    $ref: '#/definitions/vehicleGetRes'
                }
            }
        }
    },
    put: {
        description: 'update vehicle details',
        parameters: [{
            name: 'body',
            in: 'body',
            description: 'vehicle Details',
            required: true,
            schema: {
                $ref: '#/definitions/vehicleModelReq'
            }
        }, {
            name: 'id',
            in: 'path',
            description: 'vehicle id',
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
                    $ref: '#/definitions/vehicleResModel'
                }
            }
        }
    }
}]
