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
                    $ref: '#/definitions/Error'
                }
            }
        }
    }
}]
