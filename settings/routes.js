'use strict';
var auth = require('../middleware/authorization');
var apiRoutes = require('../helpers/apiRoutes');
var fs = require('fs');
var loggerConfig = require('config').get('logger');
var appRoot = require('app-root-path');

var logger = require('../helpers/logger')();

module.exports.configure = function (app) {
    app.get('/', function (req, res) {
        res.render('index', { title: 'VMS-API' });
    });

    var mobileView = function (req, res, next) {
        res.log = logger.start(req.method + ' ' + req.url);
        if (req.body) {
            res.log.debug(req.body);
        }
        req.isMobile = true;
        return next();
    };

    var desktopView = function (req, res, next) {
        res.log = logger.start(req.method + ' ' + req.url);
        if (req.body) {
            res.log.debug(req.body);
        }
        req.isMobile = false;
        return next();
    };
    app.get('/swagger', function (req, res) {
        res.writeHeader(200, { "Content-Type": "text/html" });
        fs.readFile('./public/swagger.html', null, function (err, data) {
            if (err) {
                res.writeHead(404);
            }
            res.write(data);
            res.end();
        });
    });
    var api = apiRoutes(app);

    api.model('vehicles')
        .register([{
            action: 'POST',
            method: 'create'
        }, {
            action: 'GET',
            url: '/:id',
            method: 'get'
        }, {
            action: 'GET',
            method: 'search'
        }, {
            action: 'GET',
            url: '/:id/fuelLogs',
            method: 'getfuelLogs'
        }, {
            action: 'GET',
            url: '/:id/serviceLogs',
            method: 'getserviceLogs'
        }, {
            action: 'GET',
            url: '/:id/alerts',
            method: 'getalerts'
        }, {
            action: 'PUT',
            url: '/:id',
            method: 'update'
        }, {
            action: 'DELETE',
            url: '/:id',
            method: 'delete'
        },
        {
            action: 'GET',
            url: '/get/find',
            method: 'findVehicles'
        },
        {
            action: 'POST',
            url: '/images',
            method: 'vehicleImages'
        },
        {
            action: 'GET',
            url: '/images/:id',
            method: 'getImage'
        }
        ]);

    api.model('trips')
        .register([{
            action: 'POST',
            method: 'create'
        }, {
            action: 'GET',
            url: '/:id',
            method: 'get'
        }, {
            action: 'GET',
            method: 'search'
        }, {
            action: 'GET',
            url: '/:id/today',
            method: 'today'
        }, {
            action: 'PUT',
            url: '/:id',
            method: 'update'
        }, {
            action: 'DELETE',
            url: '/:id',
            method: 'delete'
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
        ]);

    api.model('summary')
        .register('REST');

    api.model('users')
        .register([{
            action: 'POST',
            method: 'create'
        }, {
            action: 'POST',
            url: '/signIn',
            method: 'signIn'
        },
        {
            action: 'GET',
            method: 'search'
        }]);

    api.model('documents')
        .register([{
            action: 'POST',
            method: 'create',
            filter: auth.requiresToken
        }, {
            action: 'GET',
            url: '/:id',
            method: 'get'
        }, {
            action: 'GET',
            method: 'search'
        }, {
            action: 'GET',
            url: '/:id/today',
            method: 'today'
        }, {
            action: 'PUT',
            url: '/:id',
            method: 'update'
        }, {
            action: 'DELETE',
            url: '/:id',
            method: 'delete'
        }, {
            action: 'GET',
            url: '/document/download',
            method: 'download'
        }]);

    api.model('notes')
        .register([{
            action: 'POST',
            method: 'create',
            filter: auth.requiresToken
        },{
            action: 'GET',
            method: 'search'
        // },{
        //     action: 'GET',
        //     url: '/note/download',
        //     method: 'download'
        }]);

    api.model('fuellogs')
        .register('REST');

    api.model('alerts')
        .register('REST');
    api.model('servicelogs')
        .register('REST');
    api.model('tunnels')
        .register([{
            action: 'POST',
            method: 'create',
        }, {
            action: 'GET',
            url: '/vehicleUpdate',
            method: 'vehicleUpdate'
        }]);
    api.model('locationLogs')
        .register([{
            action: 'PUT',
            url: '/trace/location',
            method: 'storeLocationLogs'
        }, {
            action: 'GET',
            url: '/get/location/:id',
            method: 'getLocationLogs'
        }]);
};