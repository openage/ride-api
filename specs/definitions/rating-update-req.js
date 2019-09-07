module.exports = [{
    name: 'ratingUpdateReq',
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
        status: {
            type: 'string'
        },
        note: {
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