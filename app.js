var express = require('express');
var app = express();
var myvalue = process.env.JAVA_HOME;
var myvalue2 = process.env.PASSWORD;
app.get('/', function(req, res) {
  res.send({
    "myvalue2": myvalue2,
    "myvalue" : myvalue
  });
  //console.log (process.env.MYVALUE);
});

app.get('/keepalive', function(req, res) {
	var timestamp = Date.now();
	  res.send({
		  timestamp
	  });
	  console.log (process.env.MYVALUE);
	});

app.post('/', function(req, res) {
  res.set('Content-Type', 'text/html');
  res.send({
    "Output": "process.env.MYVALUE"
  });
  res.send('<p>some html here</p>');
});


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
