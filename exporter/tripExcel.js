'use strict';
var _ = require('underscore');
var moment = require('moment');
var excelbuilder = require('msexcel-builder');
var responseHelper = require('../helpers/response');
var path = require('path');

exports.build = function(trips, cb ) { 
    var response = responseHelper();
    var fileName = 'trips' + (new Date()).getTime() + '.xlsx';
    var count = {};
    var row = 3;
    let totalColumn = trips.length;
    let totalRows = trips.length + 3;
    var workbook = excelbuilder.createWorkbook('./temp/', fileName);
    var sheet1 = workbook.createSheet('sheet1', 12, totalRows);
    sheet1.width(1, 20);
    sheet1.width(2, 20);
    sheet1.width(3, 20);
    sheet1.width(4, 20);
    sheet1.width(5, 20);
    sheet1.width(6, 20);
    sheet1.width(7, 20);
    sheet1.width(8, 20);
    sheet1.width(9, 20);
    sheet1.width(10, 20);
    sheet1.width(11, 20);
    sheet1.width(12, 20);
    
    
 
    sheet1.border(1, 2, { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' });
    sheet1.border(2, 2, { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' });
    sheet1.border(3, 2, { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' });
    sheet1.border(4, 2, { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' });
    sheet1.border(5, 2, { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' });
    sheet1.border(6, 2, { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' });
    sheet1.border(7, 2, { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' });
    sheet1.border(8, 2, { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' });
    sheet1.border(9, 2, { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' });
    sheet1.border(10, 2, { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' });
    sheet1.border(11, 2, { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' });
    sheet1.border(12, 2, { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' });
    sheet1.font(1, 2, { name: 'Arial', bold: 'true', s: '24', family: '3' });
    sheet1.font(2, 2, { name: 'Arial', bold: 'true', s: '24', family: '3' });
    sheet1.font(3, 2, { name: 'Arial', bold: 'true', s: '24', family: '3' });
    sheet1.font(4, 2, { name: 'Arial', bold: 'true', s: '24', family: '3' });
    sheet1.font(5, 2, { name: 'Arial', bold: 'true', s: '24', family: '3' });
    sheet1.font(6, 2, { name: 'Arial', bold: 'true', s: '24', family: '3' });
    sheet1.font(7, 2, { name: 'Arial', bold: 'true', s: '24', family: '3' });
    sheet1.font(8, 2, { name: 'Arial', bold: 'true', s: '24', family: '3' });
    sheet1.font(9, 2, { name: 'Arial', bold: 'true', s: '24', family: '3' });
    sheet1.font(10, 2, { name: 'Arial', bold: 'true', s: '24', family: '3' });
    sheet1.font(11, 2, { name: 'Arial', bold: 'true', s: '24', family: '3' });
    sheet1.font(12, 2, { name: 'Arial', bold: 'true', s: '24', family: '3' });
    sheet1.set(1, 2, 'Emp name');
    sheet1.set(2, 2, 'Destination');
    sheet1.set(3, 2, 'Purpose');
    sheet1.set(4, 2, 'Passenger');
    sheet1.set(5, 2, 'Duration');
    sheet1.set(6, 2, 'Date');
    sheet1.set(7, 2, 'Time');
    sheet1.set(8, 2, 'Status');
    sheet1.set(9, 2, 'Rejection Reason');
    sheet1.set(10, 2, 'Driver');
    sheet1.set(11, 2, 'Vehicle');
    sheet1.set(12, 2, 'Vehicle No');

    _.each(trips, function(data) {

 
        sheet1.set(1,  row, data.employee ?  data.employee.name : '');
        sheet1.set(2,  row, data.destination);
        sheet1.set(3,  row, data.purpose);
        sheet1.set(4,  row, data.passengers);
        sheet1.set(5,  row, data.duration);
        sheet1.set(6,  row, moment(data.date).format('L') );
        sheet1.set(7,  row, moment(data.date).format("hh:mm:ss a") );
        sheet1.set(8,  row, data.status);
        sheet1.set(9,  row, data.rejectionReason);
        sheet1.set(10, row,data.driver ?  data.driver.name : '');
        sheet1.set(11, row, data.vehicleType);
        sheet1.set(12, row, data.vehicleNo);   
        row++;
    });
    workbook.save(function(ok) {
        console.log('workbook saved ' + (ok ? 'ok' : 'failed'));
      cb (null, {
            path: path.join(__dirname, '..', '/temp/' + fileName),
            name: 'trip.xlsx'
        });
    });
 };

