var cronJob = require('cron').CronJob,
    loader = require('./loader/lib/loader');

new cronJob('*/1 * * * *', function () {
    loader.players(72);
}, null, true, "Europe/London"););
