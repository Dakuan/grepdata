var path = require('path'),
    subject = require('../lib/loader'),
    Player = require('../lib/models/player'),
    Town = require('../lib/models/town'),
    chai = require('chai'),
    nock = require('nock'),
    mongo = require('../lib/utils/get-db'),
    expect = chai.expect;

describe('loader', function () {
    this.timeout(12000);
    describe('load players', function () {
        var fakefile;
        beforeEach(function (done) {
            fakefile = nock('http://en72.grepolis.com')
                .get('/data/players.txt.gz')
                .replyWithFile(200, path.resolve(__dirname, './resources/players.txt.gz'));
            mongo.getDb().then(function (db) {
                db.dropDatabase(function () {
                    db.close();
                    done();
                });
            });
        });
        it('should load the players', function (done) {
            subject(Player)(72).then(function () {
                mongo.getDb().then(function (db) {
                    db.collection('players').count(function (err, count) {
                        expect(count).to.eq(49596);
                        db.close();
                        done();
                    });
                });
            });
        });
        it('should pass on the worldId', function (done) {
            subject(Player)(72).then(function (worldId) {
                expect(worldId).to.eq(72);
                done();
            });
        });
    });
    describe('load towns', function () {
        var fakefile;
        before(function (done) {
            fakefile = nock('http://en72.grepolis.com')
                .get('/data/towns.txt.gz')
                .replyWithFile(200, path.resolve(__dirname, './resources/towns.txt.gz'));
            mongo.getDb().then(function (db) {
                db.dropDatabase(function () {
                    db.close();
                    done();
                });
            });
        });
        it('should load the players', function (done) {            
            subject(Town)(72).then(function () {
                mongo.getDb().then(function (db) {
                    db.collection('towns').count(function (err, count) {
                        expect(count).to.eq(37949);
                        db.close();
                        done();
                    });
                });
            });
        })
    })
});
