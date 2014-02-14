var csv = require('csv'),
    Q = require('q'),
    _ = require('underscore'),
    keys = ['playerId', 'name', 'allianceId', 'points', 'rank', 'towns'];

exports.parse = function (file) {
    var csv = require('csv'),
        def = Q.defer();
    csv()
        .from(file)
        .to.array(function (data, count) {
            def.resolve(data);
        })
        .transform(function (row, index) {
            return _(keys).reduce(function (memo, key, i) {
                memo[key] = row[i];
                return memo;
            }, {});
        });

    return def.promise;
};
