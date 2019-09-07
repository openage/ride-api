'use strict'
const fs = require('fs')
const paramCase = require('param-case')

const definitions = {}

const formDefinition = data => {
    let def = {}
    for (var key in data) {
        if (typeof data[key] === 'object') {
            def[key] = {
                type: 'object',
                properties: formDefinition(data[key])
            }
        } else {
            def[key] = {
                type: data[key]
            }
        }
    }

    return def
}

const extract = (data, name) => {
    if (data.properties) {
        return [data]
    }

    let def = formDefinition(data)
    let modelReq = {
        name: `${name}Req`,
        definition: {
            type: 'object',
            properties: def
        }
    }

    let modelRes = {
        name: `${name}Res`,
        definition: {
            type: 'object',
            properties: {
                isSuccess: {
                    type: 'boolean',
                    description: 'true'
                },
                error: {
                    type: 'string',
                    description: 'error details'
                },
                message: {
                    type: 'string',
                    description: 'validation message'
                },
                data: {
                    type: 'object',
                    properties: def
                }
            }
        }
    }

    let pageRes = {
        name: `${name}PageRes`,
        isSuccess: {
            type: 'boolean',
            description: 'true'
        },
        error: {
            type: 'string',
            description: 'error details'
        },
        message: {
            type: 'string',
            description: 'validation message'
        },
        items: {
            type: 'array',
            properties: def
        }
    }

    return [modelReq, modelRes, pageRes]
}

const setDefaults = (data, fileName) => {
    let item = {
        name: null,
        definition: {}
    }

    if (data.definition) {
        item.name = data.name || paramCase(fileName)
        item.definition.type = data.definition.type || 'object'
        item.definition.properties = data.definition.properties
    } else if (data.properties) {
        item.name = data.name || paramCase(fileName)
        item.definition.type = data.type || 'object'
        item.definition.properties = data.properties
    } else {
        item.name = paramCase(fileName)
        item.definition.properties = data
        item.definition.type = 'object'
    }
    return item
};

(function () {
    fs.readdirSync(__dirname).forEach(function (file) {
        if (file.indexOf('.js') && file.indexOf('index.js') < 0) {
            let name = file.split('.')[0]
            let data = require('./' + file)
            if (!data.forEach) {
                data = extract(data, paramCase(name))
            }
            data.forEach(item => {
                item = setDefaults(item, name)
                definitions[item.name] = item.definition
            })
        }
    })
})()

module.exports = definitions
