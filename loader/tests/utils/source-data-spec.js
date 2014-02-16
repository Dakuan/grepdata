var path = require('path'),
    SourceData = require('../../lib/utils/source-data'),
    chai = require('chai'),
    nock = require('nock'),
    expect = chai.expect;

describe('SourceData', function () {
    describe('#players', function () {
        var fakefile;
        before(function () {
            fakefile = nock('http://en72.grepolis.com')
                .get('/data/players.txt.gz')
                .replyWithFile(200, path.resolve(__dirname, '../resources/players.txt.gz'));
        });
        it('should return a stream', function (done) {
            SourceData.players(72).then(function (file) {
                fakefile.done();
                done();
            });
        })
    })
});
