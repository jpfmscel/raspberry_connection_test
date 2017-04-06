var http = require('http');
var mongoose = require('mongoose');


var options = {
  host: 'www.google.com',
  path: '/',
};






//					START
// ========================================================================================================

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('MongoDB connected to localhost.');

	var testSchema = mongoose.Schema({
		    				url: String,
		    				timestamp : Date,
		    				success : String,
		    				reason : String
						});

	var Test = mongoose.model('Test', testSchema);

	var interval = setInterval(function() {

		callback = function(response) {
					  var str = ''
					  response.on('data', function (chunk) {
					    str += chunk;
					  });

					  response.on('end', function () {
					    //console.log(str);
					    console.log('Request ok - ' + new Date());
					    var testMongo = new Test({url:'www.google.com', timestamp: new Date(), success: 'true', reason : 'ok'});
					    testMongo.save(function (err, testMongo) {
			  				if (err) return console.error(err);
						});
					  });
					}

		

		  	var req = http.get(options, callback);
			req.end();
			
			req.on('error', function(e) {
			  	console.log('ERROR: ' + e.message);
			  	var testMongo = new Test({url:'www.google.com', timestamp: new Date(), success: 'false', reason : e.message});
			  	testMongo.save(function (err, testMongo) {
			  		if (err) return console.error(err);
				});
			});
			req.on('timeout', function(e) {
			  	console.log('ERROR: ' + e.message);
			  	var testMongo = new Test({url:'www.google.com', timestamp: new Date(), success: 'false', reason : 'TIMEOUT' + e.message});
			  	testMongo.save(function (err, testMongo) {
			  		if (err) return console.error(err);
				});
			});

	}, 3000);

});







