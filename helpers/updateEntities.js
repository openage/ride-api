'use strict'

exports.update = (entitiesToUpdate, existingModel) => { // both coming as object
    for (let key in entitiesToUpdate) {
        existingModel[key] = entitiesToUpdate[key] // change if exist otherwise add in it
    }
    return existingModel
}
