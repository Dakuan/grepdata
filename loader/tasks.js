var cronJob = require('cron').CronJob,
    time = require('time'),
    loader = require('./lib/loader');

// new cronJob('*/5 * * * *', function () {
    loader.players(72);
// }, null, true, "Europe/London");