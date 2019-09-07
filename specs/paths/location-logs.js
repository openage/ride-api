module.exports = [{
    url: '/',
    post: {
        description: 'location log',
        parameters: [{
            name: 'body',
            in: 'body',
            description: 'location details',
            required: true,
            schema: {
                $ref: '#/definitions/locationCreateReq'
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
                    $ref: '#/definitions/locationCreateRes'
                }
            }
        }
    }
}]
