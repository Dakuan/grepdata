var loader = require('../lib/loader'),
    pruner = require('../lib/pruner');
exports.updatePlayers = function () {
    loader.players(72).then(function () {
        pruner(72);
    });
}

exports.updatePlayers()
