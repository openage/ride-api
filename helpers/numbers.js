'use strict';
Number.prototype.toPaddedString = function(width, padding) {
    padding = padding || '0';
    width = width || 2;
    var n = this + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(padding) + n;
};