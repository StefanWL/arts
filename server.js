var express = require('express');
var history = require('connect-history-api-fallback');
var path = require('path');
var serveStatic = require('serve-static');

var app = express();
app.use(history({
  verbose: true
}))
app.use(serveStatic(path.join(__dirname, '/dist')));

const port = process.env.PORT || 80;
app.listen(port);