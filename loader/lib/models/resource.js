var csv = require('../utils/parse-csv'),
    _ = require('underscore'),
    pluralize = require('pluralize'),
    util = require("util"),
    persister = require('../utils/persister');

function Resource() {}

Resource.prototype.primaryKey = function () {
    return this.constructor.name.toLowerCase() + 'Id';
};

Resource.prototype.collectionName = function () {
    return pluralize(this.constructor.name.toLowerCase());
};

Resource.prototype.persist = function (records) {
    return persister(this.indexes,
        this.collectionName(),
        this.primaryKey(),
        records);
};

Resource.prototype.parse = function (file) {
    return csv(this.attributes)(file);
};

module.exports = Resource;
