var fs = require('fs'),
	 db = require('mysql');


var database = {};
database.queries = (function() {
	return {
		"DBQ001": 'select long_text_04 "category", short_text_04 "code" from t04_project;',
		"DBQ002": 'select t01.case_01 "case", t01.subject_01 "description", t01.status_01 "status", t01.description_01 "details" from t01_case t01, t04_project t04 where t01.project_01 = t04.project_01 and t04.short_text_04 = ? order by t01.case_01 asc;',
	};
}());

database.tools = (function() {
	var me = this;
	me.cfg = {};
	me.cfg.connection = db.createConnection({ user: "root", password: "mysql", database: "test" });
	return {
		cfg: this.cfg,

		encodeHTML: function(str) {
			var tmp = (str).replace(/\n/g, '<br/>').replace(/\r/g, '');
			log4js.log( 'tools.encodeHTML input = ' + str );
			log4js.log( 'tools.encodeHTML result = ' + tmp );
			return tmp;
		},

		connect: function() {
			cfg.connection = db.createConnection({ user: "root", password: "mysql", database: "test" });
		},

		getConnection: function() {
			if( cfg.connection )
				return cfg.connection;
			else
				return null;
		}
	};
}());

var log4js = (function() {
	var me = this;
	me.data = {};
	me.data.loglevel = 0;
	return {
		data: this.data,

		setLogLevel: function(level) {
			this.data.loglevel = level;	
		},

		log: function( str ) {
			if( this.data.loglevel > 0 ) {
				console.log( str );
			}
		}
	};
}());



/*
 * This is a test function. It receives the SQL statement and delivers
 * the result wrapped inside the model details required by ITSM Sencha
 * Touch 2 app. The missing aspect is the line terminator substituted 
 * by the <br/> markup and eventually fetching the patch information
 */ 
function testDB( callback, q, res ) {
// <<<
	console.log('requestHandler.query: >' + q + '<');
		try {
			database.tools.getConnection().query(q, function (error, rows, fields) {
				if( error ) throw({name: "DB Error", message: error});
				res.writeHead(200, {
					'Content-Type': 'x-application/json'
				});
				// Send data as JSON string.
				// Rows variable holds the result of the query.
				// Add new attribute required by Sencha Model to terminate the lists ...
				for ( var iterator in rows ) {
					rows[iterator].leaf="true";
					rows[iterator].details = database.tools.encodeHTML( rows[iterator].details );
				}
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(rows));
				res.end('}},"responseDetails":null,"responseStatus":200}');
			});
		}
		catch(e) {
			console.log(e.name + " - " + e.message );
			res.writeHead(404);
			res.end(e.name + ': ' + e.message);
		}
}
// >>>


function queryDB( callback, q, res ) {
// <<<
	console.log('requestHandler.query: >' + q + '<');
		try {
			database.tools.getConnection().query(q, function (error, rows, fields) {
				if( error ) throw({name: "DB Error", message: error});
				res.writeHead(200, {
					'Content-Type': 'x-application/json'
				});
				// Send data as JSON string.
				// Rows variable holds the result of the query.
				// Add new attribute required by Sencha Model to terminate the lists ...
				for ( var iterator in rows ) {
					rows[iterator].leaf="true";
					rows[iterator].details = database.tools.encodeHTML( rows[iterator].details );
				}
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(rows));
				res.end('}},"responseDetails":null,"responseStatus":200}');
			});
		}
		catch(e) {
			console.log(e.name + " - " + e.message );
			res.writeHead(404);
			res.end(e.name + ': ' + e.message);
		}
}
// >>>


function search( callback, pattern, res ) {
// <<<
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
// >>>


function send_file( callback, dataName, res ) {
// <<<
	var dataFile = '/tmp/' + dataName + '.data';
	console.log('requestHandler.send: requested file: ' + dataFile );
	fs.readFile(dataFile, 'utf-8', function (error, data) {
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
// >>>


function describe( callback, dataName, res ) {
// <<<
	var dbq;
	console.log('requestHandler.describe: requested file: ' + dataName );
	try {
		console.log('requestHandler.describe: constructing descriptor file' );
//		dbq = 'select long_text_04 "category", short_text_04 "code" from t04_project;';
		database.tools.getConnection().query(database.queries.DBQ001, function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error});
			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});
			// Add time stamp
			var tmp = new Date();
			for ( var iterator in rows ) {
				rows[iterator].title="OTCS Cases (" + tmp.toDateString() + ")";
			}
			// Add new entry for patches
			var idx = rows.length;
			rows[idx] = {};
			rows[idx].category = "Patches";
			rows[idx].title = "Patches for current products";
			rows[idx].code = "Patches";

			// Format reply
			res.write( callback + '(' );
			res.write('{"support_data": { "feed": { "title":"support data", "entries":');
			res.write(JSON.stringify(rows));
			res.write('}},"responseDetails":null,"responseStatus":200}');
			res.end(')');
		});
	}
	catch(e) {
		console.log(e.name);
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
// >>>
}


function send( callback, dataName, res ) {
// <<<
	var dbq;
	console.log('requestHandler.send: requested project: ' + dataName );
	try {
//		dbq = 'select t01.case_01 "case", t01.subject_01 "description", t01.status_01 "status", t01.description_01 "details" from t01_case t01, t04_project t04 where t01.project_01 = t04.project_01 and t04.short_text_04 = ? order by t01.case_01 asc;';
		database.tools.getConnection().query(database.queries.DBQ002, [dataName], function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error});
			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});
			// Add terminators for leaf objects in the generated list and
			// process details. Convert the line breaks into HTML markup.
			for ( var iterator in rows ) {
				rows[iterator].leaf="true";
				rows[iterator].details = database.tools.encodeHTML( rows[iterator].details );
			}
			res.write( callback + '(' );
			res.write('{"support_data": { "feed": { "title":"support data", "entries":');
			res.write(JSON.stringify(rows));
			res.write('}},"responseDetails":null,"responseStatus":200}');
			res.end(')');
		});
	}
	catch(e) {
		console.log(e.name);
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>


function save( callback, dataObj, res ) {
// <<<
	var fileText;
	var data;

	try {
		data = JSON.parse(dataObj);
		console.log('requestHandler.save: ' + data.caseNo + ": " + data.caseTxt );
		if( typeof data.caseNo != 'string' ) throw( { name: 'Case Number Invalid', message: 'The case number is invalid or too complex. Use digits only' } );
		fileText = data.caseNo + ':' + data.caseTxt + "\n" ;
		fs.appendFile('/tmp/m.itsm.status', fileText, function (err) {
  			if (err) throw err;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end( 'data recieved and stored' );
			res.end(callback + '(\"data received and stored\")' );
		});
	} 
	catch(e) {
		console.log(e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>


function unlink( callback, dummy, res ) {
// <<<
	var fileText;

	console.log('requestHandler.unlink');

	try {
		fs.unlink('/tmp/m.itsm.status', function (err) {
  			if (err) throw err;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end( 'data recieved and stored' );
			res.end(callback + '(\"data received and stored\")' );
		});
	} 
	catch(e) {
		console.log(e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
//>>>


exports.search = search;
exports.describe = describe;
exports.send = send;
exports.save = save;
exports.unlink = unlink;
exports.queryDB = queryDB;
exports.testDB = testDB;

