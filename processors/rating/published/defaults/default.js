'use strict'
const appRoot = require('app-root-path')
const async = require('async')
const vehicleService = require(`${appRoot}/services/vehicles`)
const ratingService = require(`${appRoot}/services/ratings`)
const userService = require(`${appRoot}/services/users`)
const driverService = require(`${appRoot}/services/drivers`)
const logger = require('@open-age/logger')('rate.create.default')

exports.process = (data, context, callback) => {
    context.logger.start('process')

    async.waterfall([
        (cb) => {
            ratingService.getById(data.id, context)
                .then((rate) => {
                    return cb(null, rate)
                })
        },
        (rate, cb) => {
            Promise.all([ratingService.ratingCount(rate), ratingService.reviewCount(rate), ratingService.starCount(rate)])
                .spread((ratingCount, reviewCount, starCount) => {
                    if (rate.rate && rate.comment) {
                        switch (rate.rate) {
                        case 1:
                            rate.rate = rate.rate - 1
                            break
                        case 2:
                            rate.rate = rate.rate - 2
                            break
                        case 3:
                            rate.rate = rate.rate + 2
                            break
                        case 4:
                            rate.rate = rate.rate + 1
                            break
                        default:
                            break
                        }
                    }
                    if (starCount.length) {
                        starCount.forEach(star => {
                            switch (star._id) {
                            case 1:
                                rate.oneStar = star.count
                                break
                            case 2:
                                rate.twoStar = star.count
                                break
                            case 3:
                                rate.threeStar = star.count
                                break
                            case 4:
                                rate.fourStar = star.count
                                break
                            case 5:
                                rate.fiveStar = star.count
                                break
                            default:
                                break
                            }
                        })
                    }
                    rate.ratingCount = ratingCount
                    rate.reviewCount = reviewCount
                    return cb(null, rate)
                })
        },
        (rate, cb) => {
            if (!rate.vehicle) {
                return cb(null, rate)
            }

            Promise.all([vehicleService.getById(rate.vehicle, context)])
                .spread((vehicle) => {
                    vehicle.rating.rate = ((vehicle.rating.rate || 0) + rate.rate) / rate.ratingCount
                    vehicle.rating.reviewCount = rate.reviewCount
                    vehicle.rating.rateCount = rate.ratingCount
                    vehicle.rating.oneStar = rate.oneStar
                    vehicle.rating.twoStar = rate.twoStar
                    vehicle.rating.threeStar = rate.threeStar
                    vehicle.rating.fourStar = rate.fourStar
                    vehicle.rating.fiveStar = rate.fiveStar
                    vehicle.save()
                    return cb(null, rate)
                })
        },
        (rate, cb) => {
            if (!rate.driver) {
                return cb(null)
            }

            Promise.all([driverService.getById(rate.driver, context)])
                .spread((driver) => {
                    driver.rating.rate = ((driver.rating.rate || 0) + rate.rate) / rate.ratingCount
                    driver.rating.reviewCount = rate.reviewCount
                    driver.rating.rateCount = rate.rateCount
                    driver.rating.oneStar = rate.oneStar
                    driver.rating.twoStar = rate.twoStar
                    driver.rating.threeStar = rate.threeStar
                    driver.rating.fourStar = rate.fourStar
                    driver.rating.fiveStar = rate.fiveStar
                    driver.save()
                    return cb(null)
                })
        }
    ], (err) => {
        if (err) {
            return err
        }
    })
}
