'use strict'

const mapper = require('../mappers/brand')
const brandService = require('../services/brands')

exports.create = async (req) => {
   let log = req.context.logger.start('api:brands:create')

   let brand = await brandService.create(req.body, req.context)

   return mapper.toModel(brand)
}

exports.search = async (req) => {
    let log = req.context.logger.start('api:brands:search')

    let query = {}

    if(req.query.name) {
        query.name = req.query.name
    }

    let brandList = await db.brand.find(query)
    
    log.end()

    return mapper.toSearchModel(brandList)
}