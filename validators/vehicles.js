'use strict';

var uploader = require('../helpers/fileUploader');
var imageUploader = function(reqUpdate, callback) {
    uploader.withFileForm(reqUpdate, function(err, field, files) {
        if (err) {
            return callback(err);
        }
        if (files.length === 0) {
            return callback('file not found');
        }
        uploader.dataUpload(files.file, function(err, data) {
            if (err) {
                return callback(err);
            }
            if (reqUpdate.query) {
                reqUpdate.query.fileUrl = data.data.url;
            }
            if (reqUpdate.body) {
                reqUpdate.body.fileUrl = data.data.url;
            }
            return callback(null);
        });
    });
};

exports.canVehicleImages = function(req, callback) {
    imageUploader(req, function(err, imageData) {
        if (err) {
            callback(err);
        }
        callback(null);
    });
};