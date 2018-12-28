'use strict';
var _ = require('underscore');

exports.toModel = function(entity) {
    return {
        id: entity.id,
        vehicleNo: entity.vehicle?entity.vehicle.vehicleNo :'',
        visible: entity.visible,
        name: entity.name,
        date: entity.createdAt,
        isArchive: entity.isArchive,
        documentPath: entity.documentPath,
        uploadedBy:entity.user?entity.user.name:'',
        note: entity.note?entity.note:'',
    };
};
exports.toSearchModel = function(entities) {
    return _.map(entities, exports.toModel);
};