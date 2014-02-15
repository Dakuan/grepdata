var loader = require('../loader').players,
    pruner = require('../pruner').players;

function updatePlayers(world) {
    loader(world)
        .then(pruner);
}

module.exports = updatePlayers;

updatePlayers(72)
