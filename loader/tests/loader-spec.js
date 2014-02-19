var path = require('path'),
    subject = require('../lib/loader'),
    Player = require('../lib/models/player'),
    Town = require('../lib/models/town'),
    chai = require('chai'),
    nock = require('nock'),
    mongo = require('../lib/utils/get-db'),
    expect = chai.expect;

describe('loader', function () {
    var fakefile;

    before(function () {
        fakefile = nock('http://en72.grepolis.com')
            .persist()
            .get('/data/players.txt.gz')
            .replyWithFile(200, path.resolve(__dirname, './resources/players_small.txt.gz'));
    });
    after(function () {
        nock.restore();
    });
    this.timeout(40000);
    describe('load players', function () {
        beforeEach(function (done) {
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
                        expect(count).to.eq(39);
                        db.close();
                        done();
                    });
                });
            });
        });
        it('should load the playersonly once', function (done) {
            subject(Player)(72)
            .then(subject(Player))
            .then(function () {
                mongo.getDb().then(function (db) {
                    db.collection('players').count(function (err, count) {
                        expect(count).to.eq(39);
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
                        expect(count).to.eq(35);
                        db.close();
                        done();
                    });
                });
            });
        })
    })
});
