var mongoose = require('mongoose'),
	_ = require('underscore'),
    Q = require('q');

mongoose.connect('localhost', 'grepo_test');

var Player = mongoose.model('Player', {
    id: Number,
    name: String,
    points: Number,
    rank: Number
});

exports.persist = function (playerStream) {

    var total = 0,
        start = new Date().getTime();

    function clearPlayers() {
        var deferred = Q.defer();
        Player.collection.remove(function (error, result) {
            deferred.resolve();
        });
        return deferred.promise;
    }

    function persistPlayers() {
        var counter = 0;
        var deferred = Q.defer();
        playerStream
            .each(function (player) {
                counter++;
                total++;
                Player.create(player, function (err) {
                    if (err) {
                        console.log(err);
                        throw 'boom';
                    }
                    deferred.notify(player);
                    counter--;
                });
            })
            .onComplete(function () {
                _.defer(function () {
                    deferred.resolve();
                });
            });
        return deferred.promise;
    }

    function finishUp() {
        var end = new Date().getTime();
        var time = (end - start) / 1000;
        console.log('Proccessed ' + total + ' players');
        console.log('Execution time: ' + time + ' seconds');
        console.log('completed');
        mongoose.connection.close();
    }

    clearPlayers()
        .then(persistPlayers)
        .then(finishUp, function () {}, function (progress) {
            //console.log(progress);
        });
}
