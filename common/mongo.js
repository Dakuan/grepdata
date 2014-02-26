var MongoClient = require('mongodb').MongoClient,
    Q = require('q');

function _getDb() {
    var deferred = Q.defer(),
        url = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/grepo_test';
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        deferred.resolve(db);
    });
    return deferred.promise;
};

function _unitOfWork(job) {
    var deferred = Q.defer(),
        promise = deferred.promise;
    _getDb().then(function (db) {
        job(deferred, db);
        promise.fin(function () {
            db.close();
        });
    });
    return promise;
}

exports.unitOfWork = _unitOfWork;
exports.getDb = _getDb;