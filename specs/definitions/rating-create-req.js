module.exports = [{
    name: 'ratingCreateReq',
    properties: {
        rate: {
            type: 'number'
        },
        title: {
            type: 'string'
        },
        comment: {
            type: 'string'
        },
        photos: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        trip: {
            type: 'object',
            properties: {
                id: {
                    type: 'string'
                }
            }
        }
    }
}]
