'use strict'
var fs = require('fs')
var node_env = process.env.NODE_ENV || 'dev'

module.exports = function (res) {
    return {
        success: function (message, code) {
            var val = {
                isSuccess: true,
                message: message,
                code: code
            }
            res.log.info(message || 'success', val)
            res.json(val)
        },
        failure: function (error, code, message) {
            // res.status(error.status);
            var val = {
                isSuccess: false,
                message: message || error,
                error: error,
                code: code
            }
            res.log.error(message || 'failed', error)
            res.json(val)
        },
        accessDenied: function (error, message) {
            res.status(error.status || 400)
            var val = {
                isSuccess: false,
                message: message,
                error: error
            }
            res.log.error(message || 'failed', val)
            res.json(val)
        },
        data: function (item, message, code) {
            var val = {
                isSuccess: true,
                message: message,
                data: item,
                code: code
            }
            res.log.info(message || 'success', val)
            res.json(val)
        },
        page: function (items, pageNo, total, totalRecords) {
            var val = {
                isSuccess: true,
                pageNo: pageNo || 1,
                items: items,
                total: total || items.length,
                totalRecords: totalRecords || items.length
            }

            res.log.info('page', val)
            res.json(val)
        },
        download: function (path, name) {
            res.download(path, name)
        }
    }
}
