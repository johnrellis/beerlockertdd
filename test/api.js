var request = require('supertest');
var db = require('../db-credentials-test');
var app = require('../app')(db);
var assert = require('assert');
var Beer = require('../models/beer');

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
			.send({body : {
				name: 'sierra nevada',
				type: 'pale ale',
				quantity: '5'
			}})
			.expect(200)
			.end(function(err, res) {
				if (err) throw err;
				Beer.count(function(err, count) {
					if (err) throw err;
					assert.equal(count, 1);
					done();
				});
			});
	});
});
