module.exports = [{
    name: 'updateTripStatus',
    properties: {
        status: {
            type: 'string'
        },
        notes: {
            type: 'array',
            items: {
                properties: {
                    text: {
                        type: 'string'
                    },
                    date: {
                        type: 'date'
                    }
                }
            }
        }
    }
}]
