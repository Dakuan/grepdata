var _ = require('underscore'),
    MongoClient = require('mongodb').MongoClient,
    Q = require('q');

exports.persist = function (playerStream) {
    var deferred = Q.defer(),
        total = 0,
        count = 0;

    function getDb() {
        var deferred = Q.defer(),
            url = process.env['MONGOLAB_URI'] || 'mongodb://127.0.0.1:27017/grepo_test'
        MongoClient.connect(url, function (err, db) {
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
            .forEach(function (player) {
                count++;
                collection.update({
                    playerId: player.playerId
                }, player, {
                    upsert: true
                }, function (err, docs) {
                    if (err) {
                        throw new Error(err)
                    }
                    count--;
                    total++;
                    deferred.notify(player);
                    if (count === 0) {
                        deferred.resolve(db);
                    }
                });
            })
        return deferred.promise;
    }

    function finishUp(db) {
        db.close();
        return total;
    }
    process.stdout.write('Processing players');

    var dot = setInterval(function () {
        process.stdout.write('.');
    }, 200);
    getDb()
        .then(createIndex)
        .then(persistPlayers)
        .then(finishUp, function (err) {
            console.log(err);
        }, function (progress) {
            // process.stdout.write('.')
        })
        .then(function (total) {
            process.stdout.write('\n');
            clearInterval(dot);
            deferred.resolve(total);
        })

    return deferred.promise;
}
