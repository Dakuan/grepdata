var Alliance = require('../models/alliance'),
    loader = require('../loader')(Alliance),
    pruner = require('../pruner')(Alliance);

function updateAlliances(world) {
    loader(world).then(pruner);
}

module.exports = updateAlliances;

updateAlliances(72)
