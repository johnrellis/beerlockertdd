module.exports = function(dbCredentials) {
	// Get the packages we need
	var express = require('express');
	var mongoose = require('mongoose');
	var bodyParser = require('body-parser');
	var Beer = require('./models/beer');
	var util = require('util');

	mongoose.connect(dbCredentials.url);

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function(callback) {
		console.log('connected to mongo')
		Beer.count(function(err, count) {
			if (err) throw err;
			console.log(count + ' Beers Loaded');
		})
	});

	// Create our Express application
	var app = express();

	app.set('port', process.env.PORT || 3000);
	app.set('db', db);

	// Use the body-parser package in our application
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	// Create our Express router
	var router = express.Router();

	// Initial dummy route for testing
	// http://localhost:3000/api
	router.get('/', function(req, res) {
		res.json({
			message: 'You are running dangerously low on beer!'
		});
	});

	// Register all our routes with /api
	app.use('/api', router);

	// Create a new route with the prefix /beers
	var beersRoute = router.route('/beers');

	beersRoute.put(function(req, res) {
		// Create a new instance of the Beer model
		var beer = new Beer();

		console.log('Attempting to put ' + JSON.stringify(req.body));
		// Set the beer properties that came from the POST data
		beer.name = req.body.name;
		beer.type = req.body.type;
		beer.quantity = req.body.quantity;

		if (beer.name && beer.type && beer.quantity) {
			// Save the beer and check for errors
			beer.save(function(err) {
				if (err)
					res.send(err);

				res.json({
					message: 'Beer added to the locker!',
					data: beer
				});
			});
		} else {
			res.status(400).json({
				message: 'you must have name, type and quantity'
			});
		}

	});

	beersRoute.get(function(req, res) {
		Beer.find(function(err, beer) {
			var json = beer
			if (err) {
				json = {
					message: 'error finding beer ' + err
				};
			}
			res.json(json);
		});
	});

	var beerRoute = router.route('/beers/:id')

	beerRoute.get(function(req, res) {
		Beer.findById(req.params.id, function(err, beer) {
			if (err) {
				res.status(500).json({
					message: 'error retrieving beer ' + err
				});
			} else if (beer) {
				res.json(beer);
			} else {
				res.status(404).json({
					message: 'Beer is gone!'
				});
			}
		});
	});


	beerRoute.put(function(req, res) {
		Beer.findById(req.params.id, function(err, beer) {
			if (err) {
				console.log(err + '!!!!');
				res.status(500).json({
					message: 'error drinkin beer ' + err
				});
			} else if (beer) {
				beer.quantity = beer.quantity - req.body.quantity;
				beer.save(function(err) {
					if (err) res.status(500).json({
						error: err
					});
					console.log('sending 200');
					res.status(200).send();
				});
			} else {
				res.status(404).json({
					message: 'No beer to drink!'
				});
			}
		});
	});
	
	beerRoute.delete(function(req, res) {
		Beer.remove({_id : req.params.id}, function(err) {
			if (err) {
				res.status(500).json({
					message: 'error retrieving beer ' + err
				});
			} else {
				res.status(200).send();
			}
		});
	});



	return app;
}
