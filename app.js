var cronJob = require('cron').CronJob,
    loader = require('./loader/lib/loader');

new cronJob('*/15 * * * *', function () {
    loader.players(72);
});
