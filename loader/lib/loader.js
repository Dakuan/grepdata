var sourceData = require('./utils/source-data'),
    Q = require('q');

module.exports = function (resource) {
    var parser = resource.prototype.parse,
    persister = resource.prototype.persist,
    file = resource.prototype.collectionName();

    function load(world) {
        var deferred = Q.defer(),
            start = new Date().getTime();

        function onComplete(total) {
            var end = new Date().getTime(),
                time = (end - start) / 1000;
            console.log('Processed: ' + total + ' ' + file);
            console.log('Execution time: ' + time + ' seconds');

            // promise the worldId to enable chaining
            deferred.resolve(world);
        }

        sourceData(world, file)
            .then(parser)
            .then(persister)
            .then(onComplete);

        return deferred.promise;
    }

    return load;
};
