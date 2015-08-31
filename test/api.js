var request = require('supertest');
var app = require('../app')();
var assert = require('assert');


describe('/api', function() {
	it('should return low beer message', function(done) {
		request(app)
			.get('/api')
			.expect(200)
			.end(function(err, res) {
				if(err) throw err;
				assert.equal(res.body.message, 'You are running dangerously low on beer!');
				done();
			});
	});
});