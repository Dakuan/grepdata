var sourceData = require('./source-data'),
    Q = require('q'),
    parser = require('./player-parser'),
    mongo = require('./get-db');

module.exports = function (world) {
    sourceData.players(world)
        .then(parser.parse)
        .then(getIdArray)
        .then(function (ids) {

            console.log(ids.length)

            mongo.getDb().then(function (db) {
                var collection = db.collection('players');
                collection.find({
                    'playerId': {
                        '$nin': ids
                    }
                }).toArray(function (err, docs) {
                    console.log("Returned " + docs.length + " documents");
                    db.close();
                });
            });
        });
}

function getIdArray(playerStream) {
    var deferred = Q.defer(),
        ids = [];
    playerStream.forEach(function (player) {
            ids.push(player.playerId);
        })
    deferred.resolve(ids);
    return deferred.promise;
}
