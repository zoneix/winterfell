var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send({
    "Output": process.env.MYVALUE
  });
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
