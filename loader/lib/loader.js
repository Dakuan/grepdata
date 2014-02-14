var sourceData = require('./utils/source-data'),
    persist = require('./players/player-persist'),
    parser = require('./players/player-parser'),
    Q = require('q');

function loadPlayers(world) {
    var deferred = Q.defer();

    function onComplete(total) {
        var end = new Date().getTime(),
            time = (end - start) / 1000;
        console.log('Processed: ' + total + ' players');
        console.log('Execution time: ' + time + ' seconds');

        // promise the worldId to enable chaining
        deferred.resolve(world);
    }

    var start = new Date().getTime();

    sourceData.players(world)
        .then(parser.parse)
        .then(persist.persist)
        .then(onComplete);

    return deferred.promise;
}

exports.players = loadPlayers;
