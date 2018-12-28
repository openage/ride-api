'use strict';
global.Promise = require('bluebird');
var express = require('express');
var logger = require('./helpers/logger')('app');
var http = require('http');
var path = require('path');
var webServer = require('config').get('webServer');

var cors = require('cors');

require('./helpers/numbers');

var app = express();
app.use(cors());

require('./settings/express').configure(app);
require('./settings/routes').configure(app);
require('./settings/database').configure();



app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);
var port = process.env.PORT || webServer.port || 3000;
logger.info('environment:' + process.env.NODE_ENV);
logger.info('starting to listen on port:' + port);

server.listen(port, function () {
    logger.info('now listening on port:' + port);
});

module.exports = app;