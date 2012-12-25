/* OTCS Monitor
 * ------------
 * Node.js scripts delivering the data to Sencha Touch 2.0 application,
 * names "OTCS Monitor". The server is extreamely simple, is actually
 * just identifies the JSON files serialized on file system. Additionally
 * the server code provides "search" functio and thus supports the search
 * page in Client. It is highly recommended to use node-inspector component
 * for scipt debugging.
 */  
var	http = require('http'),
		url = require('url'),
		fs = require('fs'),
		db = require('mysql');

var opentext = {};
opentext.tools = {};
opentext.tools = (function() {
	var me = this;
	me._data = {};
	return {
		members: this._data,

		search: function( callback, pattern, res ) {
			console.log('opentext.tools.search search for >' + pattern + '<');
			fs.readFile( '/tmp/all.data', 'utf-8', function( error, data ) {
				var a = [];
				var counter = 0;
				console.log('opentext.tools.processData enter');
				try {
					if( error ) throw error;
					me._data.cases = JSON.parse(data);
					me._data.reply = JSON.parse(data);
					me._data.reply.support_data.feed.entries = [];
					a = me._data.cases.support_data.feed.entries;
					console.log( 'No. entries: ' + a.length );
					for ( var i in a ) {
						console.log('Case: ' + a[i].description);
						if( a[i].description.search( pattern ) !== -1 ) {
							me._data.reply.support_data.feed.entries[counter++] = a[i];
//							console.log('Pattern : ' + pattern + ' found in case: ' + a[i].description );
						}
					}
				}
				catch(e) {
					console.error('Error: ' + e.name + " - " + e.message );
				}
				console.log('opentext.tools.processData leave');
				 
				res.writeHead(200, {
					'Content-Type': 'text/plain'
				});
				res.end(callback + '(' + JSON.stringify(me._data.reply) + ')');
			});
		},

		send: function( callback, dataName, res ) {
			console.log('opentext.tools.send requested file: ' + dataName );
			fs.readFile(dataName, 'utf-8', function (error, data) {
				res.writeHead(200, {
					'Content-Type': 'text/plain'
				});
				try {
					if( error ) throw error;
					res.end(callback + '(' + data + ')');
				}
				catch(e) {
					console.log(e.name);
					res.writeHead(404);
					res.end(e.name + ': ' + e.message);
				}
			});
		}
	};
}());

var connection = db.createConnection({ user: "root", password: "mysql", database: "test" });

http.createServer(function (req, res) {
	req.on('end', function () {
		// Query the database.
		try {
			connection.query('SELECT * FROM t01_case;', function (error, rows, fields) {
				if( error ) throw(error);
				res.writeHead(200, {
					'Content-Type': 'x-application/json'
				});
				// Send data as JSON string.
				// Rows variable holds the result of the query.
				res.end(JSON.stringify(rows));
			});
		}
		catch(e) {
			console.log(e.name + " - " + e.message );
			res.writeHead(404);
			res.end(e.name + ': ' + e.message);
		}
	});
}).listen(38080, '127.0.0.1');

/*
http.createServer(function (req, res) {
	req.on('end', function () {
		var params = url.parse(req.url, true).query;
		var search = params['search'];
		var dataName = '/tmp/' + params['otcs'] + '.data';
		var callBack = params['processSupportData'];

		if( typeof search !== 'undefined' ) {
			console.log('Searching for OTCS Case: ' + search );
			opentext.tools.search( callBack, search, res );
		} else {
			opentext.tools.send( callBack, dataName, res );
		}
	});
}).listen(38080, '127.0.0.1');
*/
console.log('Server running at http://127.0.0.1:38080/');
