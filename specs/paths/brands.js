module.exports = [{
    url: '/',
    post: {
        parameters: ['x-role-key', {
            name: 'body',
            schema: {
                $ref: '#/definitions/brandsReq'
            }
        }],
        responses: {
            default: {
                description: 'Unexpected error',
                schema: {
                    $ref: '#/definitions/brandsRes'
                }
            }
        }
    },
    get: { parameters: ['x-role-key', 'name'] }
}]