'use strict';
var uploader = require('../helpers/fileUploader');

exports.canCreate = function(req, callback) {
    uploader.withFileForm(req, function(err, field, files) {
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
            req.query.fileUrl = data.data.url;
            return callback(null);
        });
    });
};