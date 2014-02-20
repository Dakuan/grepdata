var _ = require('underscore'),
    mongo = require('../../loader/lib/utils/get-db'),
    helpers = require('../../common/underscore-helpers'),
    Q = require('q');

function join(db, parents, opts) {
    var fKey = opts.fKey,
        collectionName = opts.collectionName,
        prop = opts.prop,
        deferred = Q.defer(),
        modelsWithChild = _(parents).reject(function (p) {
            return p[fKey] === null;
        }),
        childIds = _(modelsWithChild).pluck(fKey),
        query = {};
    query[fKey] = {
        $in: childIds
    };
    db.collection(collectionName).find(query, function (err, collection) {
        collection.toArray(function (err, items) {
            var filtered = helpers.mapOmit(['_id'])(items);
            filtered.forEach(function (item) {
                var filteredParents = _(parents).filter(function (p) {
                    return p[fKey] === item[fKey];
                });
                filteredParents.forEach(function (fp) {
                    fp[prop] = item;
                });
            });
            deferred.resolve(helpers.mapOmit([fKey])(parents));
        });
    });
    return deferred.promise;
}

function getTotal(collection) {
    var deferred = Q.defer();
    collection.count(function (err, count) {
        deferred.resolve(count);
    });
    return deferred.promise;
}

module.exports = {
    all: function (skip, limit) {
        var deferred = Q.defer();
        mongo.getDb().then(function (db) {
            var collection = db.collection('players');
            getTotal(collection).then(function (count) {
                collection.find().skip(skip).limit(limit).toArray(function (err, items) {
                    console.log(count);
                    console.log('total pages = ' + Math.ceil(count / limit));
                    join(db, items, {
                        fKey: 'allianceId',
                        collectionName: 'alliances',
                        prop: 'alliance'
                    }).then(function (ps) {
                        var filtered = helpers.mapOmit(['_id'])(ps);
                        deferred.resolve(filtered);
                    });
                });
            });
        });
        return deferred.promise;
    }
}
