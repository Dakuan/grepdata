var _ = require('underscore'),
    mongo = require('../../loader/lib/utils/get-db'),
    helpers = require('../../common/underscore-helpers'),
    Q = require('q');

function join(db, parents, opts) {
    var fKey = opts.fKey,
        collectionName = opts.collectionName,
        prop = opts.prop,
        modelsWithChild = _(parents).reject(function (p) {
            return p[fKey] === null;
        }),
        childIds = _(modelsWithChild).pluck(fKey),
        query = {};
    query[fKey] = {
        $in: childIds
    };

    function getChildren() {
        var deferred = Q.defer();
        db.collection(collectionName).find(query, function (err, collection) {
            deferred.resolve(collection);
        });
        return deferred.promise;
    }

    function joinChildren(collection) {
        var deferred = Q.defer();
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
        return deferred.promise;
    }

    return getChildren().then(joinChildren)
}

function getTotal(collectionName) {
    return unitOfWork(function (deferred, db) {
        var collection = db.collection(collectionName);
        collection.count(function (err, count) {
            deferred.resolve(count);
        });
    });
}

function unitOfWork(job) {
    var deferred = Q.defer(),
        promise = deferred.promise;
    mongo.getDb().then(function (db) {
        job(deferred, db);
        promise.fin(function () {
            db.close();
        });
    });
    return promise;
}

function joinOne(db, player) {
    var deferred = Q.defer();
    var allianceId = player.allianceId;
    var collection = db.collection('alliances');
    collection.findOne({
        allianceId: allianceId
    }, function (err, alliance) {
        player.alliance = alliance;
        delete player.allianceId;
        deferred.resolve(player);
    });
    return deferred.promise;
}

module.exports = {
    getTotal: function () {
        return getTotal('players');
    },

    find: function (id) {
        return unitOfWork(function (deferred, db) {
            var collection = db.collection('players');
            var query = {
                playerId: parseInt(id)
            };
            collection.findOne(query, function (err, player) {
                joinOne(db, player).then(function (player) {
                    deferred.resolve(player);
                });
            });
        });
    },

    all: function (skip, limit, query, options) {
        return unitOfWork(function (deferred, db) {
            var collection = db.collection('players');
            collection.find(query, options).skip(skip).limit(limit).toArray(function (err, items) {
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
    },

    stats: function (id, options) {
        return unitOfWork(function (deferred, db) {
            var collection = db.collection('playerStats');
            collection.find({
                playerId: parseInt(id)
            }, {}, options).toArray(function (err, stats) {
                _.each(stats, function (stat) {
                    stat['date'] = stat._id.getTimestamp().toJSON();
                });
                deferred.resolve(stats);
            })
        });
    }
}
