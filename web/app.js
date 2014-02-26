require('newrelic');

var express = require('express'),
    playersController = require('./controllers/players'),
    app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use("/assets", express.static(__dirname + "/assets"));

app.get('/players', playersController.all);
app.get('/players/:id', playersController.show);
app.get('/players/:id/stats.json', playersController.stats);

var port = Number(process.env.PORT || 5000);
app.listen(port);
console.log('Listening on port ' + port);
