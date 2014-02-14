var MongoClient = require('mongodb').MongoClient,
    Q = require('q');

exports.getDb = function () {
    var deferred = Q.defer(),
        url = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/grepo_test';
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        deferred.resolve(db);
    });
    return deferred.promise;
};
