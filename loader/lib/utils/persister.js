var _ = require('underscore'),
    getDb = require('../utils/get-db').getDb,
    Q = require('q');

function persister(indicies, collectionName, primaryKey, records) {
    var deferred = Q.defer(),
        total = 0,
        count = 0;

    function createIndicies(db) {
        function createIndex(index) {
            var deferred = Q.defer();
            db.ensureIndex(collectionName, index, function (err) {
                deferred.resolve(db);
            });
            return deferred.promise;
        }
        var deferred = Q.defer();
        Q.all(indicies.map(createIndex))
            .then(function () {
                deferred.resolve(db);
            });
        return deferred.promise;
    }

    function persist(db) {
        var collection = db.collection(collectionName),
            deferred = Q.defer();
        records.forEach(function (record) {
            count++;
            var query = {};
            query[primaryKey] = record[primaryKey];
            collection.update(query, record, {
                upsert: true
            }, function (err, docs) {
                if (err) {
                    throw new Error(err);
                }
                count--;
                total++;
                deferred.notify(record);
                if (count === 0) {
                    deferred.resolve(db);
                }
            });
        });
        return deferred.promise;
    }

    function finishUp(db) {
        db.close();
        return total;
    }

    process.stdout.write('Processing ' + collectionName);

    var dot = setInterval(function () {
        process.stdout.write('.');
    }, 200);

    getDb()
        .then(createIndicies)
        .then(persist)
        .then(finishUp, function (err) {
            console.log(err);
        }, function (progress) {})
        .then(function (total) {
            process.stdout.write('\n');
            clearInterval(dot);
            deferred.resolve(total);
        });
    return deferred.promise;
}

module.exports = persister;
