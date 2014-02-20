var _ = require('underscore');

function _mapOmit(keysToOmit) {
    return function (collection) {
        return _(collection).map(function (item) {
            return _.omit(item, keysToOmit);
        });
    }
}

module.exports = {
    mapOmit: _mapOmit
};
