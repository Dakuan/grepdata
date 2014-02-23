var express = require('express'),
    playersController = require('./controllers/players'),
    app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
    res.render('index.jade', {
        title: 'hello'
    });
});

app.get('/players', playersController.all);
app.get('/players/:id', playersController.show);

var port = Number(process.env.PORT || 5000);
app.listen(port);
console.log('Listening on port ' + port);
