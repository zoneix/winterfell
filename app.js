var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send({
    "Output": "GET REQUEST RECIEVED - Hello World!"
  });
});

app.post('/', function(req, res) {
  res.set('Content-Type', 'text/html');
  res.send({
    "Output": "GOT A POST - Hello World!"
  });
  res.send('<p>some html here</p>');
});


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
