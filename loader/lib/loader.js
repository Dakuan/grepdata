var sourceData = require('./source-data'),
    persist = require('./player-persist'),
    parser = require('./player-parser'),
    _ = require('underscore'),
    fs = require('fs'),
    Q = require('Q');

exports.players = function (world) {
    var deferred = Q.defer();

    function onComplete(total) {
        var end = new Date().getTime(),
            time = (end - start) / 1000;
        console.log('Processed: ' + total + ' players');
        console.log('Execution time: ' + time + ' seconds');
        deferred.resolve();
    }

    var start = new Date().getTime();

    sourceData.players(world)
        .then(parser.parse)
        .then(persist.persist)
        .then(onComplete);

    return deferred.promise;
};
