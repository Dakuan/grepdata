var loader = cronJob = require('cron').CronJob,
    require('./loader/lib/loader');

new cronJob('*/15 * * * *', function () {
    loader.players(72);
});
