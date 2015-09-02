var request = require('supertest');
var db = require('../db-credentials-test');
var app = require('../app')(db);
var assert = require('assert');
var Beer = require('../models/beer');


beforeEach('drink all beers', function() {
	Beer.find().remove().exec();
});

describe('get /api', function() {
	it('should return low beer message', function(done) {
		request(app)
			.get('/api')
			.expect(200)
			.end(function(err, res) {
				if (err) throw err;
				assert.equal(res.body.message, 'You are running dangerously low on beer!');
				done();
			});
	});
});


describe('put /beers', function() {
	it('should create a beer', function(done) {
		Beer.find().remove().exec();
		request(app)
			.put('/api/beers')
			.send('name=dark arts')
			.send('quantity=7')
			.send('type=porter')
			.expect(200)
			.end(function(err, res) {
				if (err) throw err;
				Beer.find(function(err, beers) {
					if (err) throw err;
					assert.equal(beers.length, 1);
					assert.equal(beers[0].name, 'dark arts');
					assert.equal(beers[0].type, 'porter');
					assert.equal(beers[0].quantity, 7);
					done();
				});
			});
	});
});
