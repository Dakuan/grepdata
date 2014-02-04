var sourceData = require('./source-data'),
    persist = require('./player-persist'),
    parser = require('./player-parser');


exports.players = function (world) {
    var start = new Date().getTime(),
        file = sourceData.players(world),
        playerStream = parser.parse(file);
    persist.persist(playerStream).then(function (total) {
        var end = new Date().getTime(),
            time = (end - start) / 1000;
        console.log('Processed: ' + total + ' players');
        console.log('Execution time: ' + time + ' seconds');
        exit();
    });
}
