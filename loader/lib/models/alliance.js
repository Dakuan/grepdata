var Resource = require('../models/resource'),
    _ = require('underscore'),
    util = require('util');

function Alliance() {}

util.inherits(Alliance, Resource);

Alliance.prototype.attributes = [{
    key: 'allianceId',
    type: 'Int'
}, {
    key: 'name',
    type: 'String'
}, {
    key: 'points',
    type: 'Int'
}, {
    key: 'towns',
    type: 'Int'
}, {
    key: 'members',
    type: 'Int'
}, {
    key: 'rank',
    type: 'Int'
}];

Alliance.prototype.indexes = ['allianceId'];
_.bindAll(Alliance.prototype, 'parse', 'persist', 'collectionName', 'primaryKey');

module.exports = Alliance;
