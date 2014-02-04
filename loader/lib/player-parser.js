var Lazy = require('lazy.js'),
    _ = require('underscore'),
    keys = ['id', 'name', 'allianceId', 'points', 'rank'];

function split(line) {
    return line.split(',');
}

function lineLength(line) {
    return line.length === 6
}

function toMap(line) {
    return _(keys).reduce(function (memo, key, index) {
        memo[key] = line[index];
        return memo;
    }, {});
}

exports.parse = function (fileStream) {
    return Lazy(fileStream)
        .lines()
        .map(split)
        .filter(lineLength)
        .map(toMap);
}
