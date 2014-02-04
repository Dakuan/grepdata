var _ = require('underscore'),
    MongoClient = require('mongodb').MongoClient,
    Q = require('q');

exports.persist = function (playerStream) {
    var total = 0,
        start = new Date().getTime();

    function getDb() {
        var deferred = Q.defer();
        MongoClient.connect(process.env['MONGOLAB_URI'], function (err, db) {
            if (err) throw err;
            deferred.resolve(db)
        });
        return deferred.promise;
    }

    function createIndex(db) {
        var deferred = Q.defer();
        db.ensureIndex('players', "playerId", function (err) {
            deferred.resolve(db);
        });
        return deferred.promise;
    }

    function persistPlayers(db) {
        var collection = db.collection('players');
        var deferred = Q.defer();
        playerStream
            .each(function (player) {
                collection.update({
                    playerId: player.playerId
                }, player, {
                    upsert: true
                }, function (err, docs) {
                    if (err) {
                        console.log(err);
                        throw new Error(err)
                    }
                    total++;
                    deferred.notify(player);
                });
            })
            .onComplete(function () {
                _.defer(function () {
                    deferred.resolve(db);
                });
            });
        return deferred.promise;
    }

    function finishUp(db) {
        var end = new Date().getTime(),
            time = (end - start) / 1000,
            endMessage = 'Proccessed ' + total + ' players'
        endMessage += '\nExecution time: ' + time + ' seconds'
        endMessage += '\nCompleted'
        console.log(endMessage);
        db.close();
    }

    getDb()
    .then(createIndex)
    .then(persistPlayers)
        .then(finishUp, function (err) {
            console.log(err);
        }, function (progress) {
            console.log(progress);
        });
}
