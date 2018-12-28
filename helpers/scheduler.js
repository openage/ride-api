'use strict';
var async = require('async');
var db = require('../models/index');
var schedule = require('node-schedule');
var moment = require('moment');
var Client = require('node-rest-client').Client;
var atomsConfig = require('config').get('atoms');
var client = new Client();

var sendMessage = function(type, message, cb) {
    var templateCode, atomsApi, 
    // toAdmin
    toUser = message.emailId;
    templateCode = message.templateCode;

    if (type === 'sms') {
        // templateCode = atomsConfig.smsTemplate;
        // toAdmin = atomsConfig.phone;
        atomsApi = '/sms/send';

    } else {
        // templateCode = atomsConfig.emailTemplate;
        // toAdmin = atomsConfig.email;
        atomsApi = '/emails/send';
    }
    var args = {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": atomsConfig.token
        },
        data: {
            "template": {
                "code": templateCode

            },
            // "to": toAdmin,
            "to": toUser,
            
            "from": "ankitmanchandaa@gmail.com",
            "data": message
        }
    };

    client.post(atomsConfig.url + atomsApi, args, function(data, response) {
        if (cb) {
            cb();
        }
    });
}
// exports.build = function(newTrip){
//   var message ={}
//    if(newTrip.status==='approve') 
//    {
//            message = {
//            status:newTrip.status,
//            vehicleNo:newTrip.vehicleNo,
//            vehicleType:newTrip.vehicleType,
//            destination:newTrip.destination,
//            emailId:newTrip.employee.email,
//            employeeName:newTrip.employee.name,
//            driverName:newTrip.driver.name,
//            phone:newTrip.driver.phone,
//            date:moment(newTrip.date).format("L"),
//            time: moment(newTrip.date).format("hh:mm:ss a"),
//            adminName:newTrip.admin.name,
//            templateCode : 'gmail-notify-approve'

//         }
//     }
//         if(newTrip.status==='reject') 
//         message = { 
//             status:newTrip.status,
//             destination:newTrip.destination,
//             emailId:newTrip.employee.email,
//             employeeName:newTrip.employee.name,
//             date:moment(newTrip.date).format("L"),
//             time: moment(newTrip.date).format("hh:mm:ss a"),
//             adminName:newTrip.admin.name,
//             reason:newTrip.rejectionReason,
//             templateCode : 'gmail-notify-reject'

//         }

//         sendMessage('emails', message);
  
// }

module.exports.configure = function() { //todo: service Alert overdue+sms+email
   
    var rule = new schedule.RecurrenceRule();
   

    setInterval(() => {
        async.waterfall([
                (cb) => {
                    db.alerts.findAll({
                        include: [{ model: db.vehicle }]
                    }).then((alerts) => {
                        if (!alerts) {
                            cb('no alerts found');
                        }
                        cb(null, alerts);
                    });
                },
                (alerts, cb) => {
                    async.parallel([
                            callback => {
                                alerts.forEach((alert) => { //for updating status to overdue
                                    var endDate = moment(alert.endDate);
                                    rule.month = moment(endDate).month();
                                    rule.date = moment(endDate).date();
                                    rule.hour = moment(endDate).hour();
                                    rule.minute = moment(endDate).minute();
                                    schedule.scheduleJob(rule, () => {
                                        alert.status = 'overdue';
                                        alert.save();
                                    });
                                });
                                callback(null, alerts);
                            },
                            callback => {
                                var message = {};
                                alerts.forEach((alert) => { //for updating status to overdue
                                    var smsNotify = moment(alert.smsNotify);
                                    var endDate = moment(alert.endDate);
                                    rule.month = moment(smsNotify).month();
                                    rule.date = moment(smsNotify).date();
                                    rule.hour = moment(smsNotify).hour();
                                    rule.minute = moment(smsNotify).minute();
                                    message.expDate = moment(endDate._d).format('YYYY MM DD');
                                    if (alert.vehicle) {
                                        message.vehicleNo = alert.vehicle.vehicleNo;
                                    }
                                    message.type = alert.type;
                                    schedule.scheduleJob(rule, () => {
                                        sendMessage('sms', message);
                                    });
                                });
                                callback(null, alerts);
                            },
                            callback => {
                                var message = {};
                                alerts.forEach((alert) => { //for updating status to overdue
                                    var emailNotify = moment(alert.emailNotify);
                                    var endDate = moment(alert.endDate);
                                    rule.month = moment(emailNotify).month();
                                    rule.date = moment(emailNotify).date();
                                    rule.hour = moment(emailNotify).hour();
                                    rule.minute = moment(emailNotify).minute();
                                    message.expDate = moment(endDate._d).format('YYYY MM DD');
                                    if (alert.vehicle) {
                                        message.vehicleNo = alert.vehicle.vehicleNo;
                                    }
                                    message.type = alert.type;
                                    schedule.scheduleJob(rule, () => {
                                        sendMessage('emails', message);
                                    });
                                });
                                callback(null, alerts);
                            }
                        ],
                        (err, results) => {
                            if (err) {
                                cb(err);
                            }
                            cb(null, results);
                        });
                }
            ],
            (err) => {
                if (err) {
                    return (err);
                }
                return;
            });
    }, 60000);
};