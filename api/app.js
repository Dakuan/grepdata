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
                // var filtered = _(items).map(_.omit, '_id');
                // console.log(filtered);
                res.send(filtered);
            });
        });
    });
});

app.listen(3001);
console.log('Listening on port 3001');
