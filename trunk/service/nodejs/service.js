var http = require('http');
var url = require('url');
var _data = "/path?";

function service(route,handler) {
	http.createServer(function (req, res) {
		var params;
		req.on('data', function(chunk) {
			_data += chunk;
		});
		req.on('end', function () {
			if( req.method == "POST" && _data.length > 7 ) {
				params = url.parse( _data, true ).query;
			} else {
				params = url.parse(req.url, true).query;
			}
			_data = "/path?"; // clear the global variable before next request comes
			route(handler,params,res); 
		});
	}).listen(38080, '127.0.0.1');
	console.log('Server running at http://127.0.0.1:38080/');
}

exports.service = service;
