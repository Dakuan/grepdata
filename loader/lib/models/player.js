var Resource = require('../models/resource'),
    _ = require('underscore'),
    util = require('util');

function Player() {}

util.inherits(Player, Resource);

Player.prototype.attributes = [{
    key: 'playerId',
    type: 'Int'
}, {
    key: 'name',
    type: 'String'
}, {
    key: 'allianceId',
    type: 'Int'
}, {
    key: 'points',
    type: 'Int'
}, {
    key: 'rank',
    type: 'Int'
}, {
    key: 'towns',
    type: 'Int'
}];

Player.prototype.indexes = ['playerId'];
_.bindAll(Player.prototype, 'parse', 'persist', 'collectionName', 'primaryKey');

module.exports = Player;
