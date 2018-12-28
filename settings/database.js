'use strict';
var db = require('../models');

module.exports.configure = function() {

    db.sequelize.sync().then(function() {
        console.log('Connection established');
        // require('../helpers/scheduler').configure();
    }).catch(function(err) {
        console.log(err);
    });

};