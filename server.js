var http = require('http');
var db = require('./db-credentials-prod');
var app = require('./app')(db);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Insert beer on port ' + app.get('port'));
});


