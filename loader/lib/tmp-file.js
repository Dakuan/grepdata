var Q = require('q'),
	tmp = require('tmp');
	
exports.tmpFile = function () {
    var deferred = Q.defer();
    tmp.file({
        mode: 0644,
        postfix: '.grepo'
    }, function _tempFileCreated(err, path, fd) {
        if (err) throw err;
        deferred.resolve(path);
    });

    return deferred.promise;
}
