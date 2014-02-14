var request = require('request'),
    zlib = require('zlib'),
    Q = require('q'),
    tmp = require('./tmp-file'),
    fs = require('fs');

function getFile(world, file) {
    var deferred = Q.defer();
    tmp.tmpFile().then(function (path) {
        var url = 'http://en' + world + '.grepolis.com/data/' + file + '.txt.gz';
        console.log('downloading: ' + url);
        var writeStream = request(url)
            .pipe(zlib.createGunzip())
            .pipe(fs.createWriteStream(path));
        writeStream.on('finish', function () {
            console.log('created tmp file: ' + path);
            var reader = fs.createReadStream(path);
            deferred.resolve(reader);
        });
    });
    return deferred.promise;
}

exports.players = function (world) {
    return getFile(world, 'players');
};
