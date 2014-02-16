var Player = require('../models/player'),
    loader = require('../loader')(Player),
    pruner = require('../pruner')(Player);

function updatePlayers(world) {
    loader(world).then(pruner);
}

module.exports = updatePlayers;
