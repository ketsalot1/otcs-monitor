var fs = require('fs');

function search( callback, pattern, res ) {
	console.log('requestHandler.search: >' + pattern + '<');
	var me = {};
	me._data = {};
	fs.readFile( '/tmp/all.data', 'utf-8', function( error, data ) {
		var a = [];
		var counter = 0;
		console.log('requestHandlers.search: read file /tmp/all');
		try {
			if( error ) throw error;
			me._data.cases = JSON.parse(data);
			me._data.reply = JSON.parse(data);
			me._data.reply.support_data.feed.entries = [];
			a = me._data.cases.support_data.feed.entries;
			console.log( 'requestHandler.search: No. entries: ' + a.length );
			for ( var i in a ) {
				console.log('requestHandlers.search: Case: ' + a[i].description);
				if( a[i].description.search( pattern ) !== -1 ) {
					me._data.reply.support_data.feed.entries[counter++] = a[i];
//					console.log('Pattern : ' + pattern + ' found in case: ' + a[i].description );
				}
			}
		}
		catch(e) {
			console.error('requestHandlers.search: Error: ' + e.name + " - " + e.message );
			res.writeHead(404);
			res.end(e.name + ': ' + e.message);
		}
		 
		res.writeHead(200, {
			'Content-Type': 'text/plain'
		});
		res.end(callback + '(' + JSON.stringify(me._data.reply) + ')');
		console.log('requestHandlers.search leave');
	});
}

function send( callback, dataName, res ) {
	console.log('requestHandler.send: requested file: ' + dataName );
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

exports.search = search;
exports.send = send;

