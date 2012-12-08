var http = require('http');
var url = require('url');

function service(route,handler) {
	http.createServer(function (req, res) {
		req.on('end', function () {
			var params = url.parse(req.url, true).query;
			route(handler,params,res); 
		});
	}).listen(38080, '127.0.0.1');
	console.log('Server running at http://127.0.0.1:38080/');
}

exports.service = service;
