var repo = require('../repositories/players'),
    _ = require('underscore'),
    Q = require('q');

function paginationViewModel(count, page, perPage) {
    page = parseInt(page);
    var next, prev,
        nextPage = page + 1;
    if (page > 1) {
        prev = '/players?page=' + (page - 1);
    }
    var totalPages = Math.ceil(count / perPage)
    if ((page + 1) <= totalPages) {
        next = '/players?page=' + nextPage;
    }
    var pageRange, range = 3;
    if (page < range + 1) {
        pageRange = _.range(1, range * 2)
    } else if (page > totalPages - (range + 1)) {
        pageRange = _.range(page - (range), totalPages + 1)
    } else {
        var min = page - range,
            max = (page + range) + 1;
        pageRange = _.range(min, max);
    }
    var pages = pageRange.map(function (p) {
        return {
            number: p,
            url: '/players?page=' + p
        }
    });
    return {
        first: '/players',
        last: '/players?page=' + Math.ceil(count / perPage),
        next: next,
        prev: prev,
        pages: pages,
        page: page
    };
}

module.exports = {
    all: function (req, res) {
        var perPage = req.query.perPage || 50;
        perPage = perPage * 1;
        var page = req.query.page || 1;
        var skip = (page * perPage) - perPage;
        Q.all([
            repo.all(skip, perPage, {}, {
                "sort": [
                    ['points', 'desc']
                ]
            }),
            repo.getTotal()
        ]).then(function (results) {
            res.render('players/index', {
                players: results[0],
                pagination: paginationViewModel(results[1], page, perPage)
            });
        });
    },

    show: function (req, res) {
        repo.find(req.params.id).then(function (player) {
            res.render('players/show', {
                player: player
            });
        });
    },

    stats: function (req, res) {
        repo.stats(req.params.id, {
            limit: 24
        }).then(function (stats) {
            res.json(stats);
        });
    }
};
