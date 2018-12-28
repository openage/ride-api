'use strict';
var async = require('async');
var updateField = require('../helpers/dbQuery').updateFields;
var auth = require('../middleware/authorization');
var db = require('../models/index');
var mapper = require('../mappers/locationLogs');
var moment = require('moment');
const locationConfig = require('config').get('location');
const client = new require('node-rest-client-promise').Client();


 

exports.getLocationLogs = function (req, res) {
    
    db.locationLogs.findOne({
        where: { id: req.params.id },
       
    }).then(function (location) {
        if (!location) {
            return res.failure('no location found');
        }
     
        return res.data(mapper.toModel(location));
    }).catch(function (err) {
        res.failure(err);
    });
};
exports.storeLocationLogs = (req, res) => {
    let args = {
        headers: {
            "Content-Type": "application/json"            
        },
        parameters: {
            noPaging: true,
            // data=  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${req.body.latitude}${req.body.longitude}&key=AIzaSyA3-BQmJVYB6_soLJPv7cx2lFUMAuELlkM`
            'latlng': `${req.body.latitude}, ${req.body.longitude}`,
            'key': locationConfig.key
        }
    };

    return client.getPromise(locationConfig.baseUrl, args)
    .then((response) => {       
     
        
        if (response.data.results.length > 0) {
           var locationName = response.data.results[2].formatted_address,
          locationDescription = response.data.results[0].formatted_address
        }
   
    var data = req.body;
    db.locationLogs.build({
        tripId: data.tripId,
        longitude: data.longitude,
        latitude: data.latitude,
        time: data.time,
        locationName: locationName,
        locationDescription:locationDescription    

    })

    .save()
    .then(newLocation => {
        if (!newLocation) {
            return res.failure("location not found");
        }
        return res.data(newLocation);
    })
    .catch(err =>{
        res.failure(err);
    })
})   

};


