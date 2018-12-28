'use strict';
var _ = require('underscore');
exports.toModel = function(entity) {

    return {
        id: entity.id,
        name: entity.name,
        email: entity.email,
        dob: entity.dob,
        gender: entity.gender,
        code: entity.code,
        phone: entity.phone,
        eduUserId: entity.eduUserId,
        token: entity.token,
        username:entity.username,
        isAdmin:entity.isAdmin,
    };
};
exports.toSearchModel = function(entities) {
    return _.map(entities, exports.toModel);
};