var Q = require('q'),
    _ = require('underscore'),
    csv = require('csv');

module.exports = function (keys) {
    function parse(file) {        
        var def = Q.defer();
        csv()
            .from(file)
            .to.array(function (data, count) {
                def.resolve(data);
            })
            .transform(function (row, index) {
                return _(keys).reduce(function (memo, key, i) {
                    var val;
                    if (row[i]) {
                        val = (key.type === 'Int') ? parseInt(row[i]) : row[i].replace(/\+/g, ' ');;
                    }
                    memo[key.key] = val;
                    return memo;
                }, {});
            });
        return def.promise;
    };
    return parse;
};
