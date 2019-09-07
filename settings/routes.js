'use strict'
var auth = require('../helpers/auth')
var apiRoutes = require('@open-age/express-api')
var fs = require('fs')
var loggerConfig = require('config').get('logger')
var appRoot = require('app-root-path')
const specs = require('../specs')

var logger = require('../helpers/logger')()

module.exports.configure = function (app) {
    let specsHandler = function (req, res) {
        fs.readFile('./public/specs.html', function (err, data) {
            if (err) {
                res.writeHead(404)
                res.end()
                return
            }
            res.contentType('text/html')
            res.send(data)
        })
    }

    var mobileView = function (req, res, next) {
        res.log = logger.start(req.method + ' ' + req.url)
        if (req.body) {
            res.log.debug(req.body)
        }
        req.isMobile = true
        return next()
    }

    app.get('/', specsHandler)
    var desktopView = function (req, res, next) {
        res.log = logger.start(req.method + ' ' + req.url)
        if (req.body) {
            res.log.debug(req.body)
        }
        req.isMobile = false
        return next()
    }
    app.get('/swagger', (req, res) => {
        res.writeHeader(200, {
            'Content-Type': 'text/html'
        })
        fs.readFile('./public/swagger.html', null, function (err, data) {
            if (err) {
                res.writeHead(404)
                res.end()
                return
            }
            res.write(data)
            res.end()
        })
    })

    app.get('/specs', specsHandler)

    app.get('/api/specs', function (req, res) {
        res.contentType('application/json')
        res.send(specs.get())
    })

    var api = apiRoutes(app)

    api.model('vehicles')
        .register([{
            action: 'POST',
            method: 'create',
            filter: auth.requiresAdmin
        }, {
            action: 'GET',
            url: '/:id',
            method: 'get',
            filter: auth.requiresPassengerOrDriver

        }, {
            action: 'GET',
            method: 'search',
            filter: auth.requiresPassengerOrDriver
        }, {
            action: 'PUT',
            url: '/:id',
            method: 'update',
            filter: auth.requiresAdmin
        }, {
            action: 'DELETE',
            url: '/:id',
            method: 'delete',
            filter: auth.requiresDriver
        }])

    api.model('trips')
        .register([{
            action: 'POST',
            method: 'create',
            filter: auth.requiresPassenger
        }, {
            action: 'GET',
            url: '/:id',
            method: 'get',
            filter: auth.requiresPassengerOrDriver
        }, {
            action: 'GET',
            method: 'search',
            filter: auth.requiresPassengerOrDriver
        }, {
            action: 'PUT',
            url: '/:id',
            method: 'update',
            filter: auth.requiresPassengerOrDriver
        }, {
            action: 'DELETE',
            url: '/:id',
            method: 'delete',
            filter: auth.requiresDriver
        }, {
            action: 'GET',
            url: '/:id/today',
            method: 'today'
        }, {
            action: 'GET',
            url: '/my/awaiting',
            method: 'getAwaitingApporval',
            filter: auth.requiresToken
        }, {
            action: 'GET',
            url: '/my/approved',
            method: 'getApprovedByDate',
            filter: auth.requiresToken
        }, {
            action: 'PUT',
            url: '/my/status',
            method: 'setTripStatus'
        },
        {
            action: 'POST',
            url: '/requestTrip',
            method: 'requestTrip'
        },
        {
            action: 'GET',
            url: '/trip/excel',
            method: 'tripExcelExport'
        }
        ])

    api.model('ratings')
        .register([{
            action: 'POST',
            method: 'create',
            filter: auth.requiresPassenger
        },{
            action: 'GET',
            url: '/:id',
            method: 'get',
            filter: auth.requiresPassengerOrDriver
        }, {
            action: 'GET',
            method: 'search',
            filter: auth.requiresPassengerOrDriver
        }, {
            action: 'PUT',
            url: '/:id',
            method: 'update',
            filter: auth.requiresPassengerOrDriver
        }])

    api.model('devices').register('REST', auth.requiresAdmin)
    api.model('brands').register('REST', auth.requiresAdmin)
    

    api.model({ root: 'locationLogs', controller: 'location-logs' })
        .register([{
            action: 'POST',
            method: 'create',
            filter: [auth.requiresDeviceKey]
        }])

    api.model('hooks')
        .register([{
            action: 'POST',
            method: 'createDriver',
            url: '/driver/create',
            filter: auth.requiresDriver
        }, {
            action: 'POST',
            method: 'updateDriver',
            url: '/driver/update',
            filter: auth.requiresDriver
        },{
            action: 'POST',
            method: 'organizationUpdate',
            url: '/organization/update',
            filter: auth.requiresDriver
         },{
            action: 'POST',
            method: 'passengerUpdate',
            url: '/passenger/Update',
            filter: auth.requiresPassenger
         }])

    api.model('drivers')
        .register([{
            action: 'GET',
            method: 'search',
            filter: auth.requiresAdmin
        }, {
            action: 'GET',
            url: '/:id',
            method: 'get',
            filter: auth.requiresPassengerOrDriver
        }, {
            action: 'DELETE',
            method: 'delete',
            url: '/:id',
            filter: auth.requiresAdmin
        }
        ])

    // api.model('organizations')
    //     .register([{
    //         action: 'POST',
    //         method: 'create'
    //     },
    //     {
    //         action: 'GET',
    //         method: 'search'
    //     }
    //     ])
    // api.model('routes')
    //     .register([{
    //         action: 'POST',
    //         method: 'create'
    //         //    },
    //         //    {
    //         //        action:'GET',
    //         //        method:'search'
    //     }
    //     ])

    // api.model('documents')
    //     .register([{
    //         action: 'POST',
    //         method: 'create',
    //         filter: auth.requiresToken
    //     }, {
    //         action: 'GET',
    //         url: '/:id',
    //         method: 'get'
    //     }, {
    //         action: 'GET',
    //         method: 'search'
    //     }, {
    //         action: 'GET',
    //         url: '/:id/today',
    //         method: 'today'
    //     }, {
    //         action: 'PUT',
    //         url: '/:id',
    //         method: 'update'
    //     }, {
    //         action: 'DELETE',
    //         url: '/:id',
    //         method: 'delete'
    //     }, {
    //         action: 'GET',
    //         url: '/document/download',
    //         method: 'download'
    //     }]);

    // api.model('notes')
    //     .register([{
    //         action: 'POST',
    //         method: 'create',
    //         filter: auth.requiresToken
    //     }, {
    //         action: 'GET',
    //         method: 'search'
    //         // },{
    //         //     action: 'GET',
    //         //     url: '/note/download',
    //         //     method: 'download'
    //     }]);

    // api.model('fuellogs')
    //     .register('REST');

    // api.model('alerts')
    //     .register('REST');
    // api.model('servicelogs')
    //     .register('REST');
    // api.model('tunnels')
    //     .register([{
    //         action: 'POST',
    //         method: 'create',
    //     }, {
    //         action: 'GET',
    //         url: '/vehicleUpdate',
    //         method: 'vehicleUpdate'
    //     }]);
}
