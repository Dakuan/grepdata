var cronJob = require('cron').CronJob,
    time = require('time'),
    updatePlayers = require('./lib/tasks/update-players');
    updateTowns = require('./lib/tasks/update-towns');

new cronJob('*/5 * * * *', function () {
    updatePlayers(72);
}, function () {
    exit();
}, true, "Europe/London");

new cronJob('*/10 * * * *', function () {
    updateTowns(72);
}, function () {
    exit();
}, true, "Europe/London");


