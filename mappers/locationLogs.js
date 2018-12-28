'use strict';
var _ = require('underscore');
exports.toModel = function (entity) {
    var model = {
        // adminId:entity.adminId,
        id: entity.id,

        tripId: entity.tripId,
        longitude:entity.longitude,
        latitude: entity.latitude,
        time: entity.time,
        locationName:entity.locationName,
        locationDescription:entity.locationDescription,
      
      
        
          
    };
  
  
  

    return model;
};
exports.toSearchModel = function (entities) {
    return _.map(entities, exports.toModel);
};