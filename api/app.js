var express = require('express'),
    _ = require('underscore'),
    app = express();


app.get('/players', function (req, res) {
    require('../loader/lib/get-db').getDb().then(function (db) {
        db.collection('players', function (err, collection) {
            collection.find().toArray(function (err, items) {
                var filtered = _(items).map(function (item) {
                    return _.omit(item, '_id');
                });
                res.send(filtered);
            });
        });
    });
});

var port = Number(process.env.PORT || 5000);
app.listen(port);
console.log('Listening on port ' + port);
