var mongo = require('../utils/get-db'),
    _ = require('underscore'),
    Q = require('q')
    Player = require('../models/player');

function createStats(players, db) {
    var promises = _.map(players, function (player) {
        var deferred = Q.defer();
        db.collection('playerStats').insert({
            playerId: player.playerId,
            rank: player.rank,
            points: player.points
        }, function (err, inserted) {
            deferred.resolve(inserted);
        });
        return deferred.promise;
    });
    return promises;
}

function updatePlayerStats(world) {
    mongo.getDb().then(function (db) {
        var collection = db.collection(Player.prototype.collectionName());
        collection.find().toArray(function (err, players) {
            Q.all(createStats(players, db))
                .then(function () {
                    db.close();
                });
        });
    });
}
