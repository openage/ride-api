module.exports = [{
    url: '/',
    get: {
        parameters: ['organizationCode', 'status', 'x-role-key'],
        responses: {
            '200': {
                schema: {
                    $ref: '#/definitions/devicePageRes'
                }
            }
        }
    },
    post: {
        parameters: ['x-role-key', {
            name: 'body',
            schema: {
                $ref: '#/definitions/deviceReq'
            }
        }],
        responses: {
            default: {
                description: 'Unexpected error',
                schema: {
                    $ref: '#/definitions/deviceRes'
                }
            }
        }
    }
}, {
    url: '/{id}',
    get: {
        parameters: ['id', 'x-role-key']
    }
}]
