var sourceData = require('./source-data'),
    persist = require('./player-persist'),
    parser = require('./player-parser');


exports.players = function (world) {
    var file = sourceData.players(world);
    var playerStream = parser.parse(file);
    persist.persist(playerStream);
}
