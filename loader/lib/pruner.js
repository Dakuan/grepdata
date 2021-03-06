var sourceData = require('./utils/source-data'),
    Q = require('q'),
    _ = require('underscore'),
    mongo = require('../../common/mongo');

module.exports = function (resource) {

    var collectionName = resource.prototype.collectionName(),
        primaryKey = resource.prototype.primaryKey();

    function pruner(world) {
        var deferred = Q.defer();
        sourceData(world, collectionName)
            .then(resource.prototype.parse)
            .then(function (records) {
                return _(records).pluck(primaryKey);
            })
            .then(function (ids) {
                mongo.getDb().then(function (db) {
                    var collection = db.collection(collectionName),
                        query = {};
                    query[primaryKey] = {
                        '$nin': ids
                    };
                    collection.remove(query, function (err, removedDocs) {
                        console.log("Pruned " + removedDocs + " " + collectionName);
                        db.close();
                        deferred.resolve(world);
                    });
                });
            });
        return defer.promise;
    }
    return pruner;
};
