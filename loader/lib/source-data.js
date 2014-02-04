var request = require('request'),
    zlib = require('zlib');

function file(world, file) {
    var url = 'http://en' + world + '.grepolis.com/data/' + file + '.txt.gz';
    console.log('downloading: ' + url);
    return request(url).pipe(zlib.createGunzip());
}

exports.players = function (world) {
    return file(world, 'players')
}
