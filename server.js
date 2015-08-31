var http = require('http');
//var db = require('./db');
var app = require('./app')();

http.createServer(app).listen(app.get('port'), function(){
  console.log('Insert beer on port ' + app.get('port'));
});


