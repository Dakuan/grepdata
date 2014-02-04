var _ = require('underscore'),
    MongoClient = require('mongodb').MongoClient,
    Q = require('q');

exports.persist = function (playerStream) {
    var total = 0,
        start = new Date().getTime();

    function getDb() {
        var deferred = Q.defer();
        MongoClient.connect('mongodb://127.0.0.1:27017/grepo_test', function (err, db) {
            if (err) throw err;
            deferred.resolve(db)
        });
        return deferred.promise;
    }

    function clearPlayers(db) {
        var deferred = Q.defer();
        var collection = db.collection('players');
        collection.drop(function (error, result) {
            deferred.resolve(db);
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

    function persistPlayers(db) {
        var collection = db.collection('players');
        var deferred = Q.defer();
        playerStream
            .each(function (player) {
                collection.insert(player, function (err, docs) {
                    if (err) {
                        console.log(err);
                        throw 'boom';
                    }
                    total++;
                    deferred.notify(docs);
                });
            })
            .onComplete(function () {
                _.defer(function () {
                    deferred.resolve(db);
                });
            });
        return deferred.promise;
    }

    getDb()
        .then(clearPlayers)
        .then(persistPlayers)
        .then(finishUp, function () {}, function (progress) {
            console.log(progress);
        });
}
