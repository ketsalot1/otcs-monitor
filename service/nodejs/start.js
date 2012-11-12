var	http = require('http'),
		url = require('url'),
		fs = require('fs');

http.createServer(function (req, res) {
	req.on('end', function () {
		var params = url.parse(req.url, true).query;
		var dataName = '/tmp/' + params['otcs'] + '.data';
		var callBack = params['processSupportData'];

		console.log('Requested file: ' + dataName + '\n');

		fs.readFile(dataName, 'utf-8', function (error, data) {
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			try {
				if( error ) throw error;
				res.end(callBack + '(' + data + ')');
			}
			catch(e) {
				console.log(e.name);
				res.writeHead(404);
				res.end(e.name + ': ' + e.message);
			}
		});
	});
}).listen(38080, '127.0.0.1');
console.log('Server running at http://127.0.0.1:38080/');
