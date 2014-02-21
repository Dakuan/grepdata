var repo = require('../repositories/players'),
    Q = require('q');

function paginationViewModel(count, page, perPage) {
    var next, prev = '',
        nextPage = page + 1;
    if (page > 1) {
        prev = '/players?page=' + (--page);
    }
    if (page < Math.ceil(count / perPage)) {

        next = '/players?page=' + nextPage;
    }
    return {
        first: '/players',
        last: '/players?page=' + Math.ceil(count / perPage),
        next: next,
        prev: prev
    };
}


module.exports = {
    all: function (req, res) {
        var perPage = req.query.perPage || 50;
        perPage = perPage * 1;
        var page = req.query.page || 1;
        page = page * 1;
        var skip = (page * perPage) - perPage;

        Q.all([
            repo.all(skip, perPage),
            repo.getTotal()
        ]).then(function (results) {

            res.render('players/index', {
                players: results[0],
                pagination: paginationViewModel(results[1], page, perPage)
            });
        });
    }
};
