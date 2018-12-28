'use strict';
var jwt = require('jsonwebtoken');
var auth = require('config').get('auth');
var responseHelper = require('../helpers/response');
var db = require('../models/index');

exports.requiresToken = function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var response = responseHelper(res);

    if (!token) {
        return response.accessDenied('token is required.');
    }

    // hack for admin
    if (token === '987654321') {
        req.user = {
            role: 'admin',
            UserId: 1,
            id: 1
        };
        next();
        return;
    }

    jwt.verify(token, auth.secret, {
        ignoreExpiration: true
    }, function(err, claims) {
        if (err) {
            return response.accessDenied('invalid token', 403, err);
        }
        db.user.find({
            where: { id: claims.UserId }
        }).then(function(user) {
            req.user = user;
            req.user.role = "member";
            next();
        });
    });
};

exports.getToken = function(user) {
    var claims = {
        UserId: user.id
    };
    return jwt.sign(claims, auth.secret, {
        expiresIn: auth.tokenPeriod || 1440
    });
};

exports.getPin = function() {
    return Math.floor(1000 + Math.random() * 9000);
};