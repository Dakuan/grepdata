var repo = require('../repositories/players');

module.exports = {
    all: function (req, res) {
        var perPage = req.query.perPage || 50;
        perPage = perPage * 1;
        var page = req.query.page || 1,
            skip = (page * perPage) - perPage;
        repo.all(skip, perPage).then(function (players) {
            res.render('players/index', {
                players: players
            });
        });
    }
};
