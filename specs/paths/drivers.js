module.exports = [{
    url: '/',
    get: {
        description: 'search drivers of your organization',
        parameters: [{
            name: 'organizationCode',
            in: 'query',
            description: 'organization code',
            required: false,
            type: 'string'
        }, {
            name: 'status',
            in: 'query',
            description: 'driver status',
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
                    $ref: '#/definitions/driverGetRes'
                }
            }
        }
    }
}, {
    url: '/{id}',
    get: {
        description: 'get driver by id',
        parameters: [{
            name: 'id',
            in: 'path',
            description: 'driver id',
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
                    $ref: '#/definitions/driverGetRes'
                }
            }
        }
    },
    delete: {
        description: 'delete driver',
        parameters: [{
            name: 'id',
            in: 'path',
            description: 'driver id',
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
                    $ref: '#/definitions/driverDeleteRes'
                }
            }
        }
    }
}]
