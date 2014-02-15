var sourceData = require('./utils/source-data'),
    Q = require('q'),
    parser = require('./players/player-parser'),
    mongo = require('./utils/get-db');

exports.players = function (world) {
    var deferred = Q.defer();
    sourceData.players(world)
        .then(parser.parse)
        .then(getIdArray)
        .then(function (ids) {
            mongo.getDb().then(function (db) {
                var collection = db.collection('players'),
                    query = {
                        'playerId': {
                            '$nin': ids
                        }
                    };
                collection.remove(query, function (err, removedDocs) {
                    console.log("Pruned " + removedDocs + " players");
                    db.close();
                    deferred.resolve(world);
                });
            });
        });
    return defer.promise;
};

function getIdArray(playerStream) {
    var deferred = Q.defer(),
        ids = [];
    playerStream.forEach(function (player) {
        ids.push(player.playerId);
    });
    deferred.resolve(ids);
    return deferred.promise;
}
