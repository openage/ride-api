'use strict'
var moment = require('moment')
var responseHelper = require('../helpers/response')
var path = require('path')
const mapper = require('../mappers/trip')
const vehicleService = require('../services/vehicles')
const tripService = require('../services/trips')

exports.create = async (req) => {
    let logger = req.context.logger.start('create')

    let trip = await tripService.create(req.body, req.context)

    return mapper.toModel(trip)
}

exports.get = async (req) => {
    let logger = req.context.logger.start('get')

    let trip = await tripService.getById(req.params.id, req.context)

    return mapper.toModel(trip)
}

exports.search = async (req) => {
    let logger = req.context.logger.start('search')

    let pageNo = Number(req.query.pageNo)
    let pageSize = Number(req.query.pageSize)
    let toPage = (pageNo || 1) * (pageSize || 10)
    let fromPage = toPage - (pageSize || 10)
    let pageLmt = (pageSize || 10)

    let query = {}

    if (req.query.status) {
        query.status = req.query.status
    }

    if (req.query.vehicleId) {
        query.vehicle = req.query.vehicleId
    }

    if (req.query.driverId) {
        query.driver = req.query.driverId
    }

    if (req.query.date) {
        let fromDate = moment(req.query.date).startOf('day'),
            toDate = moment(req.query.date).endOf('day')
        query.from = {
            $gte: fromDate,
            $lt: toDate
        }
    }

    const tripsCount = db.trip.find(query).count()

    const trips = db.trip.find(query).skip(fromPage).limit(pageLmt)

    return await Promise.all([tripsCount, trips]).spread((tripsCount, trips) => {
        return mapper.toSearchModel(trips, pageLmt, pageNo, tripsCount)
    })
}

exports.update = async (req) => {
    let logger = req.context.logger.start('update')

    let trip = await tripService.getById(req.params.id, req.context)

    if (req.body.status === 'started' && !trip.destination) {
        throw 'please, select your destination'
    }

    // let model = {
    //     from: req.body.from,
    //     till: req.body.till,
    //     startTime: req.body.startTime,
    //     endTime: req.body.endTime,
    //     type: req.body.type,
    //     purpose: req.body.purpose,
    //     origin: req.body.origin,
    //     destination: req.body.destination,
    //     duration: req.body.duration,
    //     vehicle: req.body.vehicle.id,
    //     driver: req.body.driver.id,
    //     passengers: req.body.passengers
    // }

    let updatedTrip = await tripService.update(req.body, trip, req.context)

    return mapper.toModel(updatedTrip)
}

exports.updateTripStatus = async (req) => {
    let logger = req.context.logger.start('updateTripStatus')

    let model = {
        status: req.body.status
    }

    let trip = await tripService.getById(req.params.id, req.context)

    let updatedTrip = await tripService.update(model, trip, req.context)
    return mapper.toModel(updatedTrip)
}

exports.requestTrip = function (req, res) {
    var data = req.body
    Promise.all([
        vehicleService.find({
            vehicleNo: data.vehicleNo,
            type: data.vehicleType,
            picUrl: data.fileUrl || data.picUrl,
            capacity: data.capacity,
            employeeId: data.employee.id
        }),
        db.user.find({
            where: { id: data.adminId }
        })
    ]).spread((vehicle, admin) => {
        db.trip.build({
            adminId: data.adminId || null,
            vehicleNo: data.vehicleNo,
            employeeId: data.employee.id,
            purpose: data.purpose,
            destination: data.destination,
            time: data.time || null,
            duration: data.duration,
            driver: data.driver,
            status: data.status || 'start',
            date: data.date,
            passengers: data.passengers,
            rejectionReason: data.rejectionReason,
            tripMessage: data.tripMessage,
            vehicleType: data.vehicleType,
            source: data.source,
            model: data.model,
            type: data.type,
            vehicleId: vehicle != null ? vehicle.id : null
        }).save().then(function (trip) {
            if (!trip) {
                return cb('could not create trip')
            }
            return res.data(mapper.toModel(trip))
        })
    }).catch(error => {
        return res.failure(err)
    })
}

exports.tripExcelExport = function (req, res) {
    var response = responseHelper(res)
    var whereQuery = {}
    var filters = {
        status: req.query.status || '',
        date: req.query.date || '',
        employeeId: req.query.employeeId || '',
        driverId: req.query.driverId || '',
        vehicleNo: req.query.vehicleNo || ''
    }

    if (filters.vehicleNo) {
        whereQuery.vehicleNo = {
            $like: '%' + filters.vehicleNo + '%'
        }
    }
    if (filters.status) {
        whereQuery.status = filters.status
    }
    if (req.query.date) {
        let fromDate = moment(req.query.date).startOf('day'),
            toDate = moment(req.query.date).endOf('day')
        whereQuery.date = {
            $gte: fromDate,
            $lt: toDate
        }
    }

    if (filters.employeeId) {
        whereQuery.employeeId = filters.employeeId
    }

    if (filters.driverId) {
        whereQuery.driverId = filters.driverId
    }

    db.trip.findAll({
        where: whereQuery,
        include: [{ model: db.user, as: 'employee' }, { model: db.user, as: 'driver' }, { model: db.vehicle, as: 'vehicle' }]
    })

        .then(function (trips) {
            if (!trips) {
                return res.failure('no trip found')
            }
            require('../exporter/tripExcel').build(trips, (err, file) => {
                if (err) {
                    return response.failure(err)
                }
                response.download(file.path, file.name)
            })
        })
}
