var cronJob = require('cron').CronJob,
    time = require('time'),
    updatePlayers = require('./lib/tasks/update-players');

new cronJob('*/5 * * * *', function () {
    updatePlayers(72);
}, function () {
    exit();
}, true, "Europe/London");
