var express = require('express'),
    _ = require('underscore'),
    app = express();

function mapOmit(keysToOmit) {
    return function (collection) {
        return _(collection).map(function (item) {
            return _.omit(item, keysToOmit);
        });
    }
}

app.get('/players', function (req, res) {
    require('../loader/lib/utils/get-db').getDb().then(function (db) {
        db.collection('players', function (err, collection) {
            collection.find().toArray(function (err, items) {
                var filtered = mapOmit(['_id'])(items)
                res.send(filtered);
            });
        });
    });
});

var port = Number(process.env.PORT || 5000);
app.listen(port);
console.log('Listening on port ' + port);
