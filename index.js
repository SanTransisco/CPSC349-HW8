var http = require('http');
var fs = require('fs');
var extract = require('./extract');
var mime = require("mime");


var handleError = function (err, res) {
  fs.readFile("app/error.html", function(err, data) {
    res.end(data);
  });
};


var server = http.createServer(function (req, res) {
  console.log('Responding to a request.');
  var filePath = extract(req.url);

  fs.readFile(filePath, function (err, data) {
    if (err) {
      handleError(err, res);
      return;
    } else {
      res.setHeader("Content-Type", mime.getType(filePath));
      res.end(data);
    }

  });
});
server.listen(3000);