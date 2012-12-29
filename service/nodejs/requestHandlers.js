var fs = require('fs'),
	 db = require('mysql'),
	 log4js = require('log4js');

log4js.configure('log4js.configuration.json', {});

var logger = log4js.getLogger('absolute-logger');
logger.setLevel('TRACE');

//logger.trace('Entering cheese testing');
//logger.debug('Got cheese.');
//logger.info('Cheese is Gouda.');
//logger.warn('Cheese is quite smelly.');
//logger.error('Cheese is too ripe!');
//logger.fatal('Cheese was breeding ground for listeria.');

var data = [];
var database = {};
database.queries = (function() {
// <<<
	return {
		"DBQ001": 'select long_text_04 "category", short_text_04 "code" from t04_project;',
		"DBQ002": 'select t01.id_01 "id", t01.case_01 "case", t01.subject_01 "description", t01.status_01 "status", t01.description_01 "details" from t01_case t01, t04_project t04 where t01.project_01 = t04.project_01 and t04.short_text_04 = ? order by t01.case_01 asc;',
		"DBQ003": 'select name_02 "description", release_02 "case" from t02_patch where status_02 like "open";',
//		"DBQ004": 'select t01.case_01 "case", t01.subject_01 "description" from t01_case t01, t02_patch t02, t03_link t03 where t02.id_02 = t03.id_02 and t03.id_01 = t01.id_01 and t02.id_02 = ?',
//		"DBQ004": 'select t02.name_02 "patch", t02.release_02 "release", t02.status_02 "status", t01.subject_01 "description" from t01_case t01, t02_patch t02, t03_link t03 where t02.id_02 = t03.id_02 and t03.id_01 = t01.id_01 and t02.id_02 = ?;',
		"DBQ004": 'select t02.name_02 "patch", t01.subject_01 "description" from t01_case t01, t02_patch t02, t03_link t03 where t02.id_02 = t03.id_02 and t03.id_01 = t01.id_01;',
		"DBQ005": 'select t01.id_01 "id", t01.case_01 "case", t01.subject_01 "description", t01.status_01 "status", t01.description_01 "details" from t01_case t01 where t01.case_01 like ? order by t01.case_01 asc;',
		"DBQ006": 'select name_02 "text", id_02 "value" from t02_patch where status_02 like "open";',
		"DBQ007": 'insert into t03_link (id_01, id_02) values ( ?,? );',
		"DBQ008": 'nope'
	};
}());
// >>>

database.tools = (function() {
// <<<
	var me = this;
	me.cfg = {};
	me.cfg.locked = false;
	me.cfg.counter = 0;
	me.cfg.patch = "";
	me.cfg.connection = db.createConnection({ user: "root", password: "mysql", database: "test" });
	return {
		cfg: this.cfg,

		encodeHTML: function(str) {
			var tmp = (str).replace(/\n/g, '<br/>').replace(/\r/g, '');
			logger.trace( 'tools.encodeHTML input = ' + str );
			logger.trace( 'tools.encodeHTML result = ' + tmp );
			return tmp;
		},

		connect: function() {
			cfg.connection = db.createConnection({ user: "root", password: "mysql", database: "test" });
			if( cfg.connection )
				logger.trace( 'tools.connect: connection to mySQL database created' )
			else 
				logger.error( 'tools.connect: connection to mySQL database failed' )
		},

		getConnection: function() {
			if( cfg.connection ) {
				logger.trace( 'tools.getConnection: connection object requested' );
				return cfg.connection;
			}
			else {
				logger.error( 'tools.getConnection: connection object requested but connect was not called before or connect failed' );
				return null;
			}
		}
	};
}());
// >>>


/*
 * This is a test function. It receives the SQL statement and delivers
 * the result wrapped inside the model details required by ITSM Sencha
 * Touch 2 app. The missing aspect is the line terminator substituted 
 * by the <br/> markup and eventually fetching the patch information
 */ 
function testDB( callback, q, res ) {
// <<<
	logger.trace('requestHandler.query: >' + q + '<');
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
			logger.trace(e.name + " - " + e.message );
			res.writeHead(404);
			res.end(e.name + ': ' + e.message);
		}
}
// >>>


function queryDB( callback, q, res ) {
// <<<
	logger.trace('requestHandler.query: >' + q + '<');
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
			logger.error(e.name + " - " + e.message );
			res.writeHead(404);
			res.end(e.name + ': ' + e.message);
		}
}
// >>>


function search( callback, pattern, res ) {
// <<<
	logger.trace('requestHandler.search for patern: >' + pattern + '<');
	pattern = "%" + pattern + "%";
	try {
		database.tools.getConnection().query(database.queries.DBQ005, [pattern], function (error, rows, fields) {
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
			res.write( callback + '(' );
			res.write('{"support_data": { "feed": { "title":"support data", "entries":');
			res.write(JSON.stringify(rows));
			res.write('}},"responseDetails":null,"responseStatus":200}');
			res.end(')');
		});
	}
	catch(e) {
		logger.error(e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>


function search_in_file( callback, pattern, res ) {
// <<<
	logger.trace('requestHandler.search: >' + pattern + '<');
	var me = {};
	me._data = {};
	fs.readFile( '/tmp/all.data', 'utf-8', function( error, data ) {
		var a = [];
		var counter = 0;
		logger.trace('requestHandlers.search: read file /tmp/all');
		try {
			if( error ) throw error;
			me._data.cases = JSON.parse(data);
			me._data.reply = JSON.parse(data);
			me._data.reply.support_data.feed.entries = [];
			a = me._data.cases.support_data.feed.entries;
			logger.trace( 'requestHandler.search: No. entries: ' + a.length );
			for ( var i in a ) {
				logger.trace('requestHandlers.search: Case: ' + a[i].description);
				if( a[i].description.search( pattern ) !== -1 ) {
					me._data.reply.support_data.feed.entries[counter++] = a[i];
//					logger.trace('Pattern : ' + pattern + ' found in case: ' + a[i].description );
				}
			}
		}
		catch(e) {
			logger.error('requestHandlers.search: Error: ' + e.name + " - " + e.message );
			res.writeHead(404);
			res.end(e.name + ': ' + e.message);
		}
		 
		res.writeHead(200, {
			'Content-Type': 'text/plain'
		});
		res.end(callback + '(' + JSON.stringify(me._data.reply) + ')');
		logger.trace('requestHandlers.search leave');
	});
}
// >>>


function send_file( callback, dataName, res ) {
// <<<
	var dataFile = '/tmp/' + dataName + '.data';
	logger.trace('requestHandler.send: requested file: ' + dataFile );
	fs.readFile(dataFile, 'utf-8', function (error, data) {
		res.writeHead(200, {
			'Content-Type': 'text/plain'
		});
		try {
			if( error ) throw error;
			res.end(callback + '(' + data + ')');
		}
		catch(e) {
			logger.error(e.name);
			res.writeHead(404);
			res.end(e.name + ': ' + e.message);
		}
	});
}
// >>>


function describe( callback, dataName, res ) {
// <<<
	var dbq;
	logger.trace('requestHandler.describe: requested file: ' + dataName );
	try {
		logger.trace('requestHandler.describe: constructing descriptor file' );
		database.tools.getConnection().query(database.queries.DBQ001, function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error});
			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});
			// Add time stamp to the response
			var tmp = new Date();
			for ( var iterator in rows ) {
				rows[iterator].title="OTCS Cases (" + tmp.toDateString() + ")";
			}
			logger.trace( 'requestHandler.describe: added timestamp ' + tmp.toDateString() + ' to response object' );
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
		logger.error("Exception: " + e.name + ": " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>


function listPatches( callback, params, res ) {
// <<<
	logger.trace('requestHandler.listPatches: enter ' );
	try {
		database.tools.getConnection().query(database.queries.DBQ006, function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error});
			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});
			logger.trace('requestHandler.listPatches: processing list of patches >' + rows.length + '<' );
				// Format reply
			res.write( callback + '(' );
			res.write('{"support_data": { "feed": { "title":"support data", "entries":');
			res.write(JSON.stringify(rows));
			res.write('}},"responseDetails":null,"responseStatus":200}');
			res.end(')');
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + ": " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
} // >>>


function sendPatches( callback, res ) {
// <<<
	var results = [];
	logger.trace('requestHandler.preparePatches: enter ' );
	try {
		database.tools.getConnection().query(database.queries.DBQ003, function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error});
			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});
			logger.trace('requestHandler.preparePatches: processing list of patches >' + rows.length + '<' );
			results = rows;
			logger.trace('requestHandler.preparePatches: list of patches stored in results. Length = ' + results.length + '<' );
			database.tools.getConnection().query(database.queries.DBQ004, function (error, rows, fields) {
				var idc = 0;
				if( error ) throw( {name: "DB Error", "message": error });
				for ( var iterator in results ) {
					logger.trace('requestHandler.preparePatches: assigning details to patch >' + results[iterator].description + '<' );
					results[iterator].id = idc++;
					results[iterator].status = "open";
					results[iterator].details = "<ol>";
					for ( var cntr in rows ) {
						if( results[iterator].description != rows[cntr].patch ) continue;
						results[iterator].details += "<li>";
						results[iterator].details += rows[cntr].description;
						logger.trace('requestHandler.preparePatches: adding case >' + rows[cntr].description + '< to patch >' + results[iterator].description + '<' );
						results[iterator].details += "</li>";
					}
					results[iterator].details += "</ol>";
					results[iterator].leaf = "true";
				}

				logger.trace( 'requestHandler.preparePatch: formatting reply' );
				// Format reply
				res.write( callback + '(' );
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(results));
				res.write('}},"responseDetails":null,"responseStatus":200}');
				res.end(')');
			});
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + ": " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
} // >>>


function send( callback, dataName, res ) {
// <<<
	var dbq;
	logger.trace('requestHandler.send: requested project: ' + dataName );

	if( dataName == "Patches" ) {
		sendPatches( callback, res );
		return;
	} else {
		_send( callback, dataName, res );
	}
} // >>>


function linkPatch( callback, data, res ) {
// <<<
	var dataObj = JSON.parse(data);
	logger.trace('requestHandler.linkPatch: linking case >' + dataObj.caseId + '< with patch id >' + dataObj.patchId );
	try {
//		if( typeof dataObj.caseId != 'int' ) throw( { name: 'Case ID Invalid', message: 'The case id invalid or too complex. Use digits only' } );
//		if( typeof dataObj.patchId != 'int' ) throw( { name: 'Patch ID Invalid', message: 'The patch id invalid or too complex. Use digits only' } );
		database.tools.getConnection().query(database.queries.DBQ007, [dataObj.caseId, dataObj.patchId], function (error, info) {
			if( error ) throw({name: "DB Error", message: error});
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end( 'data recieved and stored' );
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
} 
// >>>


function _send( callback, dataName, res ) {
// <<<
	var dbq;
	logger.trace('requestHandler._send: requested project: ' + dataName );
	try {
		database.tools.getConnection().query(database.queries.DBQ002, [dataName], function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error});
			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});
			// Add terminators (leaf property) in the generated list and
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
			logger.trace('requestHandler.send: response object flushed to client' );
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
} // >>>


function save( callback, dataObj, res ) {
// <<<
	var fileText;
	var data;

	try {
		data = JSON.parse(dataObj);
		logger.trace('requestHandler.save: ' + data.caseNo + ": " + data.caseTxt );
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
		logger.error(e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>


function unlink( callback, dummy, res ) {
// <<<
	var fileText;

	logger.trace('requestHandler.unlink');

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
		logger.error(e.name + " - " + e.message );
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
exports.listPatches = listPatches;
exports.linkPatch = linkPatch;
