'use strict';
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var lodash = require('lodash');
var config = require('config').get('dbServer');
var logger = require('../helpers/logger')('db');
var basename = path.basename(module.filename);

logger.info('using db host: ' + config.host);
logger.info('using db db: ' + config.database);
logger.info('using db username: ' + config.username);
var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: '3306',
    logging: console.log
});

var initModels = function () {
    var log = logger.start('initModels');
    var db = {};

    log.debug('reading models');

    fs.readdirSync(__dirname)
        .filter(function (file) {
            return (file.indexOf('.') !== 0) && (file !== basename);
        })
        .forEach(function (file) {
            var model = sequelize['import'](path.join(__dirname, file));
            db[model.name] = model;
        });

    log.debug('adding relationships');

    db.vehicle.hasMany(db.documents);
    db.documents.belongsTo(db.vehicle);

    db.user.hasMany(db.documents);
    db.documents.belongsTo(db.user);
    //  db.documents.belongsTo(db.user, { as: 'user' });

    db.trip.belongsTo(db.user, { as: 'employee' });
    db.trip.belongsTo(db.user, { as: 'driver' });
    db.trip.belongsTo(db.user, { as: 'admin' });
    db.trip.belongsTo(db.vehicle, { as: 'vehicle' });
    // db.trip.belongsTo(db.locationLogs,{as:'tripId'});

    db.vehicle.belongsTo(db.user, { as: 'employee' });
    db.vehicle.hasMany(db.alerts);
    db.alerts.belongsTo(db.vehicle);

    db.vehicle.hasMany(db.fuelLog);
    db.fuelLog.belongsTo(db.vehicle);

    db.vehicle.hasMany(db.servicelLogs);
    db.servicelLogs.belongsTo(db.vehicle);

    // db.vehicle.hasMany(db.fuelLogs);
    // db.fuelLogs.belongsTo(db.vehicle);

    // db.vehicle.hasMany(db.alert);
    // db.alert.belongsTo(db.vehicle);

    //  db.vehicle.hasMany(db.schedule);
    // db.schedule.belongsTo(db.vehicle);

    // db.vehicle.hasMany(db.service);
    // db.service.belongsTo(db.vehicle);

    // db.vehicle.hasMany(db.trip);
    // db.trip.belongsTo(db.vehicle);

    // db.notes.belongsTo(db.user, { as: 'user' });
    db.user.hasMany(db.notes);
    db.notes.belongsTo(db.user);
    db.notes.belongsTo(db.trip, { as: 'trip' });


    db.notes.hasMany(db.documents);
    db.documents.belongsTo(db.notes);

 // db.documents.belongsTo(db.notes, { as: 'note' });


    Object.keys(db).forEach(function (modelName) {
        if ('associate' in db[modelName]) {
            db[modelName].associate(db);
        }
    });
    return db;
};

module.exports = lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, initModels());