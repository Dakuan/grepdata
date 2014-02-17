var Resource = require('../models/resource'),
    _ = require('underscore'),
    util = require('util');

function Town() {}

util.inherits(Town, Resource);

Town.prototype.attributes = [{
    key: 'townId',
    type: 'Int'
}, {
    key: 'playerId',
    type: 'Int'
}, {
    key: 'name',
    type: 'String'
}, {
    key: 'islandX',
    type: 'Int'
}, {
    key: 'islandY',
    type: 'Int'
}, {
    key: 'numberOnIsland',
    type: 'Int'
}, {
    key: 'Points',
    type: 'Int'
}];

Town.prototype.indexes = ['townId', 'playerId'];
_.bindAll(Town.prototype, 'parse', 'persist', 'primaryKey');

module.exports = Town;
