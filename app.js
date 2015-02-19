'use strict';
 
var express = require('express'),
    http = require('http'),
    app = express(),
    dist = '/public/',
    views = 'views/',
    server = http.createServer(app);

app.use('/js', express.static(__dirname + dist + '/js'));
app.use('/img', express.static(__dirname + dist + '/img'));
app.use('/styles', express.static(__dirname + dist + '/styles'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + dist + views + 'index.html');
});


module.exports = app;