var path = require('path');
var send = require('send');
var url = require('url');
var http = require('http');

var wwwRoot = path.resolve(__dirname, 'wwwRoot');

http.createServer(function (req, res) {

  send(req, url.parse(req.url).pathname)
    .root(wwwRoot)
    .pipe(res);

}).listen(8080);

console.log('runnig at http://localhost:8080');