var request = require('supertest');
var db = require('../db-credentials-test');
var app = require('../app')(db);
var assert = require('assert');
var Beer = require('../models/beer');
var _ = require('underscore');


var findBeer = function(array, name) {
	return _.find(array, {
		name: name
	})
};

var createBeer = function(name, quantity, type, callback) {
	request(app)
		.put('/api/beers')
		.send('name=' + name)
		.send('quantity=' + quantity)
		.send('type=' + type)
		.expect(200)
		.end(callback);
}

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
		createBeer('dark arts', 7, 'porter', function(err, res) {
			if (err) throw err;
			Beer.find(function(err, beers) {
				if (err) throw err;
				assert.equal(beers.length, 1);
				assert.equal(beers[0].name, 'dark arts');
				assert.equal(beers[0].type, 'porter');
				assert.equal(beers[0].quantity, 7);
				done();
			});
		})
	});
});

describe('put /beers', function() {
	it('should return an error when information not complete', function(done) {
		request(app)
			.put('/api/beers')
			.send('name=dark arts')
			.send('quantity=7')
			.expect(400)
			.end(function(err, res) {
				if (err) throw err;
				assert.equal(res.body.message, 'you must have name, type and quantity');
				done();
			});
	});
});


describe('get /beers', function() {
	it('should return all the beer', function(done) {
		createBeer('dark arts', 7, 'porter', function(err, res) {
			createBeer('sierra nevada', 6, 'pale ale', function(err, res) {
				request(app)
					.get('/api/beers')
					.expect(200)
					.end(function(err, getRes) {
						if (err) throw err;
						assert.equal(getRes.body.length, 2);
						assert.equal(findBeer(getRes.body, 'dark arts').quantity, 7);
						assert.equal(findBeer(getRes.body, 'sierra nevada').quantity, 6);
						done();
					});
			});
		});
	});
});


describe('get /beers/id', function() {
	it('retrieve a beer by id', function(done) {
		createBeer('rebel red', 8, 'red ale', function(err, res) {
			var id = res.body.data._id
			request(app)
				.get('/api/beers/' + id)
				.expect(200)
				.end(function(err, getRes) {
					if (err) throw err;
					assert.equal(getRes.body.name, 'rebel red');
					assert.equal(getRes.body.quantity, 8);
					assert.equal(getRes.body.type, 'red ale');
					done();
				});
		})
	});
});

describe('get /beers/id', function() {
	it('retrieve a non existant beer by id', function(done) {
		request(app)
			.get('/api/beers/507c35dd8fada716c89d0013')
			.expect(404)
			.end(function(err, res) {
				if (err) throw err;
				assert.equal(res.body.message, 'Beer is gone!');
				done();
			});
	});
});
