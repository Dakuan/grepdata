var Town = require('../models/town'),
    loader = require('../loader')(Town),
    pruner = require('../pruner')(Town);

function updateTowns(world) {
    loader(world).then(pruner);
}

module.exports = updateTowns;
