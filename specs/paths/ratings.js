module.exports = [{
    url: '/',
    post: {
        description: 'rate or review to trip',
        parameters: [{
            name: 'body',
            in: 'body',
            description: 'review and rate',
            required: true,
            schema: {
                $ref: '#/definitions/ratingCreateReq'
            }
        }, {
            name: 'x-role-key',
            in: 'header',
            description: 'Role-key (ED user)',
            required: true
        }],
        responses: {
            default: {
                description: 'Unexpected error',
                schema: {
                    $ref: '#/definitions/ratingCreateRes'
                }
            }
        }
    },
    get: {
        description: 'Get All reviews&rating',
        parameters: [{
            name: 'status',
            in: 'query',
            description: 'rating status',
            required: false
        }, {
            name: 'driverId',
            in: 'query',
            description: 'driver id',
            required: false
        }, {
        }, {
            name: 'tripId',
            in: 'query',
            description: 'driver id',
            required: false
        }, {
            name: 'vehicleId',
            in: 'query',
            description: 'vehicle id',
            required: false
        }, , {
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
            description: 'Role-key (ED user)',
            required: true
        }],
        responses: {
            default: {
                description: 'Unexpected error',
                schema: {
                    $ref: '#/definitions/ratingCreateRes'
                }
            }
        }
    }
}, {
    url: '/{id}',
    put: {
        description: 'update rating by id',
        parameters: [{
            name: 'body',
            in: 'body',
            description: 'review and rate',
            required: true,
            schema: {
                $ref: '#/definitions/ratingUpdateReq'
            }
        }, {
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
                    $ref: '#/definitions/ratingCreateRes'
                }
            }
        }
    },
    get: {
        description: 'get rating by id',
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
                    $ref: '#/definitions/ratingCreateRes'
                }
            }
        }
    }
}]
