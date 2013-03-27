var mongo = require("./mongoHandlers");
var config = require("configure");

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

var g_pending = 0;
var data = [];
var database = {};
database.queries = (function() {
// <<<
	return {
		"DBQ001": 'select project_04 "id", long_text_04 "title", short_text_04 "code" from t04_project;',
// TODO - start
//		"DBQ002": 'select t01.id_01 "id", t01.case_01 "case", t01.subject_01 "description", t01.status_01 "status", t01.description_01 "details", t01.jira_01 "jira" from t01_case t01, t04_project t04 where t01.project_01 = t04.project_04 and t01.active_01 = 1 and t04.short_text_04 = ? order by t01.case_01 asc;',
		"DBQ002": 'select t01.id_01 "id", t01.case_01 "case", t01.subject_01 "description", t01.status_01 "status", t01.description_01 "details", t01.jira_01 "jira", modified_01 as "modified" from t01_case t01, t04_project t04 where t01.project_01 = t04.project_04 and t01.active_01 = 1 and t04.short_text_04 = ? order by t01.case_01 asc;',
//		"DBQ002": 'select t01.id_01 "id", t01.case_01 "case", t01.subject_01 "description", t01.status_01 "status", t01.description_01 "details", t01.jira_01 "jira" from t01_case t01, t04_project t04 where t01.project_01 = t04.project_04 and t01.active_01 = 1 and t04.short_text_04 = ? and modified_01 >= date_sub(CURDATE(),interval ? day) order by t01.case_01 asc;',
// TODO - stop 
//		"DBQ003": 'select name_02 "description", DATE_FORMAT(release_02,"%d-%m-%Y") "case" from t02_patch where status_02 like "open" order by name_02 asc;',
		"DBQ003": 'select name_02 as "patch", CONCAT(name_02, " (",DATE_FORMAT(release_02,"%d/%m/%Y"),")") as "description", DATE_FORMAT(release_02,"%d-%m-%Y") "case" from t02_patch where status_02 like "open" order by release_02 asc;',
//		"DBQ004": 'select t02.name_02 "patch", t01.subject_01 "description" from t01_case t01, t02_patch t02, t03_link t03 where t01.active_01 = 1 and t02.id_02 = t03.id_02 and t03.id_01 = t01.id_01;',
		"DBQ004": 'select t02.name_02 "patch", t01.subject_01 "description" from t01_case t01, t02_patch t02, t03_link t03 where t02.id_02 = t03.id_02 and t03.id_01 = t01.id_01;',
		"DBQ005": 'select t01.id_01 "id", t01.case_01 "case", t01.subject_01 "description", t01.status_01 "status", t01.description_01 "details", t01.jira_01 "jira" from t01_case t01 where t01.case_01 like ? order by t01.case_01 asc;',
		"DBQ006": 'select name_02 "text", id_02 "value", DATE_FORMAT(release_02, "%m/%d/%Y") "eta" from t02_patch where status_02 like "open" order by name_02 asc;',
		"DBQ007": 'insert into t03_link (id_01, id_02) values ( ?,? );',
		"DBQ008": 'select t03.id_01 "id", t02.name_02 "patch" from t02_patch t02, t03_link t03 where t02.id_02 = t03.id_02;',
		"DBQ009": 'select description_01 "details" from t01_case where id_01 = ?;',
// TODO - start
//		"DBQ010": 'update t01_case set description_01 = ? where id_01 = ?;',
		"DBQ010": 'update t01_case set description_01 = ?, modified_01 = CURDATE() where id_01 = ?;',
// TODO - stop 
		"DBQ011": 'select name_02 "text", id_02 "value", DATE_FORMAT(release_02, "%m/%d/%Y") "eta" from t02_patch where status_02 in ("open","developed") order by name_02 asc;',
		"DBQ012": 'insert into t02_patch (name_02, release_02, status_02) values (?,CURDATE(),"open");',
		"DBQ013": 'update t02_patch set release_02 = ?, status_02 = ? where id_02 = ?;',
		"DBQ014": 'delete from t03_link where id_01 = ?;',
		"DBQ015": 'select (max(project_04)+1) "id" from t04_project;',
		"DBQ016": 'insert into t04_project( project_04,short_text_04,long_text_04) values (?,?,?);', 
		"DBQ017": 'select project_04 "value", short_text_04 "text" from t04_project;',
		"DBQ018": 'update t01_case set project_01 = ? where id_01 = ?;',
		"DBQ019": 'insert into t01_case (case_01,subject_01,status_01,description_01,start_01,project_01,active_01) values (?,?, "Just Arrived",  "\n", CURDATE(), 99, 1 );',
		"DBQ020": 'insert into t01_case (case_01,subject_01,status_01,description_01,start_01,project_01,active_01) values (?,?,?,?,?,?,? );',
		"DBQ021": 'update t01_case set active_01 = 0, stop_01 = CURDATE() where case_01 = ?;',
		"DBQ022": 'update t02_patch set status_02 = "archived" where id_02 = ?;',
		"DBQ023": 'select id_02 as "id" from t02_patch where id_02 in (select distinct t02.id_02 as "Patch ID" from t01_case t01, t02_patch t02, t03_link t03 where t01.active_01 = 0 and t02.id_02 = t03.id_02 and t03.id_01 = t01.id_01 order by t02.id_02) and id_02 not in (select distinct t02.id_02 as "Patch ID" from t01_case t01, t02_patch t02, t03_link t03 where t01.active_01 = 1 and t02.id_02 = t03.id_02 and t03.id_01 = t01.id_01 order by t02.id_02) and status_02 not like "archived";',
		"DBQ024": 'update t01_case set status_01 = ? where case_01 = ?;',
		"DBQ025": 'update t01_case set jira_01 = ? where case_01 = ?;',
		"DBQ026": 'select t01.id_01 "id", t01.case_01 "case", t01.subject_01 "description", t01.status_01 "status", t01.description_01 "details", t01.jira_01 "jira" from t01_case t01 where t01.active_01 = 1 and t01.case_01 like ? order by t01.case_01 asc;',
		"DBQ027": 'select t01.id_01 "id", t01.case_01 "case", t04.short_text_04 "owner" from t01_case t01, t04_project t04 where t01.active_01 = 1 and t01.project_01 = t04.project_04 order by t01.case_01 asc;',
		"DBQ028": 'select t01.id_01 "id", t01.case_01 "case", t01.subject_01 "description", t01.status_01 "status", t01.description_01 "details", t01.jira_01 "jira" from t01_case t01, t04_project t04 where t01.project_01 = t04.project_04 and t01.status_01 like "%lose%" and t01.active_01 = 1 order by t01.case_01 asc;',
		"DBQ029": 'insert into t05_fav values( ? );',
		"DBQ030": 'delete from t05_fav where id_01 = ?;',
		"DBQ031": 'select t01.id_01 "id", t01.case_01 "case", t01.subject_01 "description", t01.status_01 "status", t01.description_01 "details", t01.jira_01 "jira" from t01_case t01, t04_project t04, t05_fav t05 where t01.project_01 = t04.project_04 and t01.id_01 = t05.id_01 order by t01.case_01 asc;',

		"opened_last_week": 'select count(*) from t01_case where start_01 > date_sub(curdate(),interval 7 day) order by start_01 asc;',
		"closed_last_week": 'select count(*) from t01_case where stop_01 > date_sub(curdate(),interval 7 day) order by start_01 asc;',
		"new_last_week": 'select count(*) from t01_case where start_01 > subtime(now(),"7 1:1:1.000002") order by start_01 asc;',
		"closed_last_week": 'select count(*) as "count", avg(datediff(stop_01,start_01)) as "average" from t01_case where stop_01 > date_sub(curdate(),interval 7 day) order by start_01 asc;',
		"closed_last_months": 'select count(*) as "count", avg(datediff(stop_01,start_01)) as "average" from t01_case where stop_01 > date_sub(curdate(),interval 31 day) order by start_01 asc;',

		"DBQ032": 'select count(*) as "count" from t01_case where active_01 = 1;',
		"DBQ033": 'select count(*) as "count" from t01_case where start_01 >= date_sub(curdate(),interval ? day);',
		"DBQ034": 'select count(*) as "count", ceiling(avg(datediff(stop_01,start_01))) as "average" from t01_case where stop_01 >= date_sub(curdate(),interval ? day);',
		"DBQ035": 'select count(*) as "count" from t02_patch where status_02 = "open";',

		"DBQ036a": 'select t01.id_01 "id", t01.case_01 "case", t01.subject_01 "description", t01.status_01 "status", t01.description_01 "details", t01.jira_01 "jira" from t01_case t01 where t01.case_01 in (',
		"DBQ036b": ') order by t01.case_01 asc;',

		"DBQ999": 'nope'
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
//	me.cfg.connection = db.createPool({ user: "root", password: "mysql", database: "test" });
	return {
		cfg: this.cfg,

		encodeHTML: function(str) {
			var tmp = (str).replace(/\n/g, '<br/>').replace(/\r/g, '');
			logger.trace( 'tools.encodeHTML input = ' + str );
			logger.trace( 'tools.encodeHTML result = ' + tmp );
			return tmp;
		},

		/*
		setConnectionPool: function() {
			cfg.connection = db.createPool({ user: "root", password: "mysql", database: "test" });
			if( cfg.connection ) {
				logger.trace( 'tools.setConnection: connection to mySQL database created' )
				return 1;
			} else { 
				logger.error( 'tools.setConnection: connection to mySQL database failed' )
				return 0;
			}
		},	
		*/

		filter: function( num ) {
			logger.trace( "tools.filter: stripped bottom 14bits from number: " + num );
			return( num & 0x3FFF );
		},

		setConnection: function() {
			cfg.connection = db.createConnection({ user: "root", password: "mysql", database: "test" });
			if( cfg.connection ) {
				logger.trace( 'tools.setConnection: connection to mySQL database created' )
				return 1;
			} else { 
				logger.error( 'tools.setConnection: connection to mySQL database failed' )
				return 0;
			}
		},

		getConnection: function() {
			if( cfg.connection ) {
				logger.trace( 'tools.getConnection: connection object requested. Connecting ...' );
				if( !cfg.connected ) { 
					cfg.connection.connect( function(err) {
							if(err) throw(err);
					});
					cfg.connected = 1;
				} else {
					logger.error("tools.getConnection: cannot reconnect already connected object");
					return null;
				}
				logger.trace( 'tools.getConnection: connected. Returning connection object.' );
				return cfg.connection;
			} else {
				logger.warn( 'tools.getConnection: connection object requested but setConnection was not called before or connect failed. Re-creating ...' );
				if( this.setConnection() ) {
					logger.trace( 'tools.getConnection: connection object refreshed. Connecting ...' );
					if( !cfg.connected ) { 
						cfg.connection.connect( function(err) {
								if(err) throw(err);
						});
						cfg.connected = 1;
					} else {
						logger.error("tools.getConnection: cannot reconnect already connected object");
						return null;
					}
					logger.trace( 'tools.getConnection: connected. Returning connection object.' );
					return cfg.connection;
				} else {
					logger.error( 'tools.getConnection: connection object cannot be delivered.' );
					throw({name:"DB Connect", message:"Connection failure. Check the MySQL server log"});
				}
			}
		},

		closeConnection: function() {
			if( cfg.connection ) {
				cfg.connection.end();
				cfg.connection = null;
				cfg.connected = 0;
				logger.trace("tools.closeConnection: closing DB connection and destroying connection object.");
			} else {
				logger.warn("tools.closeConnection: connection seems to closed already.");
			}
		},

		toLocalDate: function( obj ) {
			var tmp;
			try {
				tmp = obj.getDate() + '.' + (obj.getMonth() + 1) + '.' + obj.getFullYear();
			}
			catch(e) {
				logger.error( "Exception: cannot convert date to local date: " + e.name );
				tmp = "01-01-1970";
			}
			return tmp;
		},

		toDBDate: function( obj ) {
			var tmp;
			try {
				tmp = obj.getFullYear()
				tmp += '-';
				if( obj.getMonth() < 9 );
					tmp += "0";
			  	tmp += (obj.getMonth() + 1);
				tmp += '-';
			  	tmp += obj.getDate(); 
				logger.info( 'toDBDate returning >' + tmp + '< representation' );
			}
			catch(e) {
				logger.error( "Exception: cannot convert date to local date: " + e.name );
				tmp = "1970-01-01 00:00:00";
			}
			return tmp;
		},

		toDBDateTime: function( obj ) {
			try {
				var tmp = this.toDBDate(obj);
				tmp += " 00:00:00";
				logger.info( 'toDBDateTime returning >' + tmp + '< representation' );
			} 
			catch(e) {
				throw(e);
			}
		},

		parseDate: function( str ) {
			var resp;
			var d;

			try {
				d = new Date(str);
				if( d instanceof Date )
         		return d;
				else 
					throw({'name': 'Parsing Error', "message": 'String >' + str + '< cannot be converted into Date object' });
			} catch(e) {
				logger.error('Parsing Error: string >' + str + '< cannot be parsed by using the known rules' );
				throw({'name': 'Parsng Error', "message": 'String >' + str + '< cannot be parsed by using the known rules' });
			}
		},
// TODO - start
		getAge: function( d1, d2 ) {
   		var ONE_DAY = 1000 * 60 * 60 * 24;

    		// Convert both dates to milliseconds
    		//var date1_ms = date1.getTime()
    		//var date2_ms = date2.getTime()

 		   // Calculate the difference in milliseconds
    		var difference_ms = Math.abs(d1 - d2);

    		// Convert back to days and return
    		return Math.round(difference_ms/ONE_DAY);
		}
// TODO - stop
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
			var connection = database.tools.getConnection();
			connection.query(q, function (error, rows, fields) {
				if( error ) throw({name: "DB Error", message: error.toString()});
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
				database.tools.closeConnection();
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
			var connection = database.tools.getConnection();
			connection.query(q, function (error, rows, fields) {
				if( error ) throw({name: "DB Error", message: error.toString()});
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
				database.tools.closeConnection();
			});
		}
		catch(e) {
			logger.error(e.name + " - " + e.message );
			res.writeHead(404);
			res.end(e.name + ': ' + e.message);
		}
}
// >>>


function search( callback, data, res ) {
// <<<
	var cases = [];
	var dataObj = JSON.parse(data);
	var q;
	var connection;

	logger.trace('requestHandler.search for patern: >' + dataObj.pattern + '<');
	var pattern = "%" + dataObj.pattern + "%";
	try {
		connection = database.tools.getConnection();
		if( dataObj.searchAll == 1 ) 
			q = database.queries.DBQ005; 
		else 
			q = database.queries.DBQ026; 
		connection.query(q, [pattern], function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});
			logger.trace('requestHandler: search found >' + rows.length + '< cases' );
			cases = rows;
			logger.trace('requestHandler: search running second quesry for patch information ...');
			connection.query(database.queries.DBQ008, function (error, rows, fields) {
				for ( var iterator in cases ) {
					cases[iterator].icon= "resources/images/iQuestion.png";
					cases[iterator].leaf="true";
					cases[iterator].details = database.tools.encodeHTML( cases[iterator].details );
					cases[iterator].patches = "Patch: ";
					for ( var iter in rows ) {
						if( cases[iterator].id != rows[iter].id ) continue; 
						logger.trace( 'requestHandler: search found patch entry (' + rows[iter].patch + ') for case (' + cases[iterator].case + ')' );
						cases[iterator].patches += rows[iter].patch;
						cases[iterator].patches += ", ";
					}
				}
				if( callback )
					res.write( callback + '(' );
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(cases));
				res.write('}},"responseDetails":null,"responseStatus":200}');
				if( callback )
					res.end(')');
				res.end();
				database.tools.closeConnection();
			});
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
			if( error ) throw error.toString();
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
	logger.trace('requestHandler.send_file: requested file: ' + dataFile );
	fs.readFile(dataFile, 'utf-8', function (error, data) {
		res.writeHead(200, {
			'Content-Type': 'text/plain'
		});
		try {
			if( error ) throw error.toString();
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
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ001, function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});
			// Add time stamp to the response
			var tmp = new Date();
			for ( var iterator in rows ) {
				if( rows[iterator].id == 99 ) {
					rows[iterator].category = "Dashboard";
					rows[iterator].icon = "resources/images/iUnassigned-2.png";
				} else {
					rows[iterator].category="OTCS Cases (" + database.tools.toLocalDate(tmp) + ")";
					rows[iterator].icon = "resources/images/iCases.png";
				}
			}
			logger.trace( 'requestHandler.describe: added timestamp ' + database.tools.toLocalDate(tmp) + ' to response object' );
			// Add new entry for patches
			var idx = rows.length;
			rows[idx] = {};
			rows[idx].id = 98;
			rows[idx].category = "Dashboard";
			rows[idx].title = "Patches";
			rows[idx].code = "Patches";
			rows[idx].icon = "resources/images/iPatches.png";

			idx++;
			rows[idx] = {};
			rows[idx].id = 97;
			rows[idx].category = "Dashboard";
			rows[idx].title = "Archive queue";
			rows[idx].code = "Transient";
			rows[idx].icon = "resources/images/iArchive2.png";

			idx++;
			rows[idx] = {};
			rows[idx].id = 96;
			rows[idx].category = "Dashboard";
			rows[idx].title = "Favorites";
			rows[idx].code = "Favorites";
			rows[idx].icon = "resources/images/iStar.png";

			idx++;
			rows[idx] = {};
			rows[idx].id = 95;
			rows[idx].category = "Dashboard";
			rows[idx].title = "Activity";
			rows[idx].code = "Feed";
			rows[idx].icon = "resources/images/iFeed.png";

			// Format reply
			res.write( callback + '(' );
			res.write('{"support_data": { "feed": { "title":"support data", "entries":');
			res.write(JSON.stringify(rows));
			res.write('}},"responseDetails":null,"responseStatus":200}');
			res.end(')');
			database.tools.closeConnection();
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + ": " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>


function listProjects( callback, params, res ) {
// <<<
	logger.trace('requestHandler.listProjects: enter ' );
	try {
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ017, function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});
			logger.trace('requestHandler.listProjects: processing list of patches >' + rows.length + '<' );
				// Format reply
			if( callback )
				res.write( callback + '(' );
			res.write('{"support_data": { "feed": { "title":"support data", "entries":');
			res.write(JSON.stringify(rows));
			res.write('}},"responseDetails":null,"responseStatus":200}');
			if( callback )
				res.write(')');
			res.end();
			database.tools.closeConnection();
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + ": " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
} // >>>


function listPatches( callback, params, res ) {
// <<<
	var dbq = null;
	logger.trace('requestHandler.listPatches: enter ' );
	try {
		if( params == 'all' ) 
			dbq = database.queries.DBQ011; 
		if( params == 'open' ) 
			dbq = database.queries.DBQ006; 
		if( dbq == null )
			throw({ name:"DB Error", message: "No query specifified." });
		var connection = database.tools.getConnection();
		connection.query(dbq, function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
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
			database.tools.closeConnection();
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + ": " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
} // >>>


function send( callback, data, res ) {
// <<<
	var dataObj = JSON.parse(data);
	logger.trace('requestHandler.send: requested project: ' + dataObj.dataName );

	if( dataObj.dataName == "Patches" ) {
		sendPatches( callback, res );
		return;
	}
	if( dataObj.dataName == "Transient" ) {
		sendUnarchived( callback, res );
		return;
	}
	if( dataObj.dataName == "Favorites" ) {
		sendFavorites( callback, res );
		return;
	}
	if( dataObj.dataName == "Feed" ) {
		mongo.retrieveRecentEmailsFromMDB( callback, data, res );
		return;
	}
	sendCases( callback, dataObj.dataName, res );
} // >>>


function sendPatches( callback, res ) {
// <<<
	var results = [];
	logger.trace('requestHandler.preparePatches: enter ' );
	try {
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ003, function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});
			logger.trace('requestHandler.preparePatches: processing list of patches >' + rows.length + '<' );
			results = rows;
			logger.trace('requestHandler.preparePatches: list of patches stored in results. Length = ' + results.length + '<' );
			connection.query(database.queries.DBQ004, function (error, rows, fields) {
				var idc = 0;
				if( error ) throw( {name: "DB Error", "message": error.toString() });
				for ( var iterator in results ) {
					logger.trace('requestHandler.preparePatches: assigning details to patch >' + results[iterator].description + '<' );
					results[iterator].id = idc++;
					results[iterator].status = "open";
					results[iterator].details = "<ol>";
					for ( var cntr in rows ) {
						if( results[iterator].patch != rows[cntr].patch ) continue;
						results[iterator].details += "<li>";
						results[iterator].details += rows[cntr].description;
						logger.trace('requestHandler.preparePatches: adding case >' + rows[cntr].description + '< to patch >' + results[iterator].description + '<' );
						results[iterator].details += "</li>";
					}
					results[iterator].details += "</ol>";
					results[iterator].leaf = "true";
					results[iterator].icon = "resources/images/iPatches.png";
				}

				logger.trace( 'requestHandler.preparePatch: formatting reply' );
				// Format reply
				res.write( callback + '(' );
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(results));
				res.write('}},"responseDetails":null,"responseStatus":200}');
				res.end(')');
				database.tools.closeConnection();
			});
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + ": " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
} // >>>


function sendCases( callback, dataName, res ) {
// <<<
	var cases = [];
// TODO - start
	var reference = new Date();
	var delta;
	var limit1;
	var limit2;

// TODO - stop
	logger.trace('requestHandler.sendCases: requested project: ' + dataName );
	try {
		limit1 = config.updateTime.updated || 2;
		limit2 = config.updateTime.pending || 9;
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ002, [dataName], function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});
			// Add terminators (leaf property) in the generated list and
			// process details. Convert the line breaks into HTML markup.
			logger.trace( 'requestHandler: send processing list of cases long >' + rows.length + '<' );
			cases = rows;
			connection.query(database.queries.DBQ008, function (error, rows, fields) {
				for ( var iterator in cases ) {
// TODO - start
					delta = database.tools.getAge( cases[iterator].modified, reference );
					logger.trace( 'requestHandler: send days isnce last update: ' + rows.length );
					cases[iterator].icon = "resources/images/iOutdated.png";
					if( delta < limit2 )
						cases[iterator].icon = "resources/images/iPending.png";
					if( delta < limit1 )
						cases[iterator].icon = "resources/images/iUpdated.png";
// TODO - stop
					cases[iterator].description = iterator + ': ' + cases[iterator].description;
					cases[iterator].leaf="true";
					cases[iterator].details = database.tools.encodeHTML( cases[iterator].details );
					cases[iterator].patches = "Patch: ";
					for ( var iter in rows ) {
						if( cases[iterator].id != rows[iter].id ) continue; 
						logger.trace( 'requestHandler: send found patch entry (' + rows[iter].patch + ') for case (' + cases[iterator].case + ')' );
						cases[iterator].patches += rows[iter].patch;
						cases[iterator].patches += ", ";
					}
				}
				res.write( callback + '(' );
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(cases));
				res.write('}},"responseDetails":null,"responseStatus":200}');
				res.end(')');
				logger.trace('requestHandler.send: response object flushed to client' );
				database.tools.closeConnection();
			});
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
} // >>>


function sendCases_nested( callback, dataName, res ) {
// <<<
	var cases = [];
// TODO - start
	var reference = new Date();
	var delta;
	var limit1;
	var limit2;

// TODO - stop
	logger.trace('requestHandler.sendCases: requested project: ' + dataName );
	try {
		limit1 = config.updateTime.updated || 2;
		limit2 = config.updateTime.pending || 9;
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ002, [dataName], function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});

			if( callback )
				res.write( callback + '(' );
			res.write('{"support_data": { "feed": { "title":"support data", "entries":[');
			res.write(' {"icon":"resources/images/iPending.png", "description":"Today","support_data":' );

			// Add terminators (leaf property) in the generated list and
			// process details. Convert the line breaks into HTML markup.
			logger.trace( 'requestHandler: send processing list of cases long >' + rows.length + '<' );
			cases = rows;
			connection.query(database.queries.DBQ008, function (error, rows, fields) {
				for ( var iterator in cases ) {
// TODO - start
					delta = database.tools.getAge( cases[iterator].modified, reference );
					logger.trace( 'requestHandler: send days isnce last update: ' + rows.length );
					cases[iterator].icon = "resources/images/iOutdated.png";
					if( delta < limit2 )
						cases[iterator].icon = "resources/images/iPending.png";
					if( delta < limit1 )
						cases[iterator].icon = "resources/images/iUpdated.png";
// TODO - stop
					cases[iterator].description = iterator + ': ' + cases[iterator].description;
					cases[iterator].leaf="true";
					cases[iterator].details = database.tools.encodeHTML( cases[iterator].details );
					cases[iterator].patches = "Patch: ";
					for ( var iter in rows ) {
						if( cases[iterator].id != rows[iter].id ) continue; 
						logger.trace( 'requestHandler: send found patch entry (' + rows[iter].patch + ') for case (' + cases[iterator].case + ')' );
						cases[iterator].patches += rows[iter].patch;
						cases[iterator].patches += ", ";
					}
				}
				// res.write( callback + '(' );
				res.write('{ "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(cases));

				res.write('}}}]');

				res.write('}},"responseDetails":null,"responseStatus":200}');
				if( callback )
					res.write(')');
				res.end();
				logger.trace('requestHandler.send: response object flushed to client' );
				database.tools.closeConnection();
			});
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
} // >>>


function sendFavorites( callback, res ) {
// <<<
	var cases = [];
	logger.trace('requestHandler.sendFavorites: requested ' );
	try {
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ031, function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});
			// Add terminators (leaf property) in the generated list and
			// process details. Convert the line breaks into HTML markup.
			logger.trace( 'requestHandler: sendFavorites processing list of cases long >' + rows.length + '<' );
			cases = rows;
			connection.query(database.queries.DBQ008, function (error, rows, fields) {
				for ( var iterator in cases ) {
					cases[iterator].icon = "resources/images/iExperimental.png";
					cases[iterator].leaf="true";
					cases[iterator].details = database.tools.encodeHTML( cases[iterator].details );
					cases[iterator].patches = "Patch: ";
					for ( var iter in rows ) {
						if( cases[iterator].id != rows[iter].id ) continue; 
						logger.trace( 'requestHandler: sendFavorites found patch entry (' + rows[iter].patch + ') for case (' + cases[iterator].case + ')' );
						cases[iterator].patches += rows[iter].patch;
						cases[iterator].patches += ", ";
					}
				}
				res.write( callback + '(' );
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(cases));
				res.write('}},"responseDetails":null,"responseStatus":200}');
				res.end(')');
				logger.trace('requestHandler.send: response object flushed to client' );
				database.tools.closeConnection();
			});
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
} // >>>


function sendUnarchived( callback, res ) {
// <<<
	var cases = [];
	logger.trace('requestHandler.sendUnarchived: requested project: ' );
	try {
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ028, function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});
			// Add terminators (leaf property) in the generated list and
			// process details. Convert the line breaks into HTML markup.
			logger.trace( 'requestHandler: sendUnarchived processing list of cases long >' + rows.length + '<' );
			cases = rows;
			connection.query(database.queries.DBQ008, function (error, rows, fields) {
				for ( var iterator in cases ) {
					cases[iterator].icon = "resources/images/iArchive.png";
					cases[iterator].leaf="true";
					cases[iterator].details = database.tools.encodeHTML( cases[iterator].details );
					cases[iterator].patches = "Patch: ";
					for ( var iter in rows ) {
						if( cases[iterator].id != rows[iter].id ) continue; 
						logger.trace( 'requestHandler: sendUnarchived found patch entry (' + rows[iter].patch + ') for case (' + cases[iterator].case + ')' );
						cases[iterator].patches += rows[iter].patch;
						cases[iterator].patches += ", ";
					}
				}
				res.write( callback + '(' );
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(cases));
				res.write('}},"responseDetails":null,"responseStatus":200}');
				res.end(')');
				logger.trace('requestHandler.sendUnarchived: response object flushed to client' );
				database.tools.closeConnection();
			});
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
	var details;
	var d = new Date();
	var resp = {};

	try {
		data = JSON.parse(dataObj);
		data.caseId = database.tools.filter( data.caseId );
		data.caseTxt = database.tools.toLocalDate(d) + ' - ' + data.caseTxt;
		logger.trace('requestHandler.save: (' + data.caseId + ') ' + data.caseNo + ": " + data.caseTxt );
		if( typeof data.caseNo != 'string' ) throw( { name: 'Case Number Invalid', message: 'The case number is invalid or too complex. Use digits only' } );
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ009, [data.caseId], function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			if( rows.length != 1 ) throw({name: "DB Error", message: "too meany entries returned for single ID. Check database table T01_CASE"});
			details = data.caseTxt + "\n" + rows[0].details;
			connection.query(database.queries.DBQ010, [details, data.caseId], function (error, info) {
				if( error ) throw({name: "DB Error", message: error.toString()});
				resp.code = "1000";
				resp.message = "OK";
				res.writeHead(200, {
					'Content-Type': 'text/plain'
				});
				res.write( callback + '(' );
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(resp));
				res.write('}},"responseDetails":null,"responseStatus":200}');
				res.end(')');
				logger.trace('requestHandler.save: response object flushed to client' );
				database.tools.closeConnection();
			});
		});
	} 
	catch(e) {
		logger.error(e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>


function linkPatch( callback, data, res ) {
// <<<
	var resp = {};
	var dataObj = JSON.parse(data);
	dataObj.caseId = database.tools.filter( dataObj.caseId );
	logger.trace('requestHandler.linkPatch: linking case >' + dataObj.caseId + '< with patch id >' + dataObj.patchId + '<, drop cmd >' + dataObj.drop + '<'  );
	try {
//		if( typeof dataObj.caseId != 'int' ) throw( { name: 'Case ID Invalid', message: 'The case id invalid or too complex. Use digits only' } );
//		if( typeof dataObj.patchId != 'int' ) throw( { name: 'Patch ID Invalid', message: 'The patch id invalid or too complex. Use digits only' } );
		if( dataObj.drop == 1 ) {
			database.tools.getConnection().query(database.queries.DBQ014, [dataObj.caseId], function (error, info) {
				if( error ) throw({name: "DB Error", message: error.toString()});
				logger.trace('requestHandler.LinkPatch: delete done. Affected rows = ' + info.affectedRows + ' message: ' + info.message );
				database.tools.closeConnection();
				_linkPatch( callback, data, res );
			});
		} else {
			_linkPatch( callback, data, res );
		}
	}
	catch(e) {
		logger.error("Exception: " + e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
} 
// >>>


function favorites( callback, data, res ) {
// <<<
	var resp = {};
	var dataObj;
	try {
		dataObj = JSON.parse(data);
		dataObj.caseId = database.tools.filter( dataObj.caseId );
		logger.trace('requestHandler.favorites: case >' + dataObj.caseId + '< with patch id >' + dataObj.caseNo + '<'  );
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ029, [dataObj.caseId], function (error, info) {
			if( error ) {
				if( error.toString().indexOf('ER_DUP_ENTRY' ) > -1 ) {
					logger.trace('requestHandler.favorites: set. Record removed from favorites');
					connection.query(database.queries.DBQ030, [dataObj.caseId], function( error, info ) {
						if( error ) throw({name: "DB Error", message:"Cannot remove from t05_fav"});
						logger.trace('requestHandler.favorites: set. Affected rows = ' + info.affectedRows + ' message: ' + info.message );
						resp.value = 0
						resp.text = info.message;
						res.writeHead(200, {
							'Content-Type': 'text/plain'
						});
						res.write( callback + '(' );
						res.write('{"support_data": { "feed": { "title":"support data", "entries":');
						res.write(JSON.stringify(resp));
						res.write('}},"responseDetails":null,"responseStatus":200}');
						res.end(')');
						database.tools.closeConnection();
					});
				} else {
					throw({name: "DB Error", message: "Cannot insert new ID into t05_fav table"});
				}
			} else {
				logger.trace('requestHandler.favorites: set. Affected rows = ' + info.affectedRows + ' message: ' + info.message );
				resp.value = 1;
				resp.text = info.message;
				res.writeHead(200, {
					'Content-Type': 'text/plain'
				});
				res.write( callback + '(' );
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(resp));
				res.write('}},"responseDetails":null,"responseStatus":200}');
				res.end(')');
				database.tools.closeConnection();
			}
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
		database.tools.closeConnection();
	}
} 
// >>>


function _linkPatch( callback, data, res ) {
// <<<
	var resp = {};
	var dataObj = JSON.parse(data);
	dataObj.caseId = database.tools.filter( dataObj.caseId );
	logger.trace('requestHandler._linkPatch: linking case >' + dataObj.caseId + '< with patch id >' + dataObj.patchId + '<, drop cmd >' + dataObj.drop + '<'  );
	try {
//		if( typeof dataObj.caseId != 'int' ) throw( { name: 'Case ID Invalid', message: 'The case id invalid or too complex. Use digits only' } );
//		if( typeof dataObj.patchId != 'int' ) throw( { name: 'Patch ID Invalid', message: 'The patch id invalid or too complex. Use digits only' } );
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ007, [dataObj.caseId, dataObj.patchId], function (error, info) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			logger.trace('requestHandler.LinkPatch: update done. Affected rows = ' + info.affectedRows + ' message: ' + info.message );
			resp.code = info.affectedRows;
			resp.message = info.message;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.write( callback + '(' );
			res.write('{"support_data": { "feed": { "title":"support data", "entries":');
			res.write(JSON.stringify(resp));
			res.write('}},"responseDetails":null,"responseStatus":200}');
			res.end(')');
			logger.trace('requestHandler._linkPatch: response object flushed to client' );
			database.tools.closeConnection();
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
} 
// >>>


function createProject( callback, data, res ) {
// <<<
	var resp = {};
	var dataObj = JSON.parse(data);
	logger.trace('requestHandler.createProject: name >' + dataObj.name + '< description >' + dataObj.description + '<'  );
	try {
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ015, function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			dataObj.id = rows[0].id;
			connection.query(database.queries.DBQ016, [dataObj.id, dataObj.name, dataObj.description], function (error, info) {
				if( error ) throw({name: "DB Error", message: error.toString()});
				logger.trace('requestHandler.createProject: inser done. Affected rows = ' + info.affectedRows + ' message: ' + info.message );
				resp.code = info.affectedRows;
				resp.message = info.message;
				res.writeHead(200, {
					'Content-Type': 'text/plain'
				});
				res.write( callback + '(' );
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(resp));
				res.write('}},"responseDetails":null,"responseStatus":200}');
				res.end(')');
				logger.trace('requestHandler.createProject: response object flushed to client' );
				database.tools.closeConnection();
			});
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
} 
// >>>


function archivePatch( callback, dataObj, res ) {
// <<<
	var fileText;
	var data;
	var details;
	var d = new Date();
	var resp = {};

	try {
		logger.trace('requestHandler.archivePatch' );
		g_pending = 0;
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ023, function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			for ( var iterator in rows ) {
				g_pending++;
				logger.trace('requestHandler.archivePatch: first query: pending counter value: ' + g_pending );
				var id = rows[iterator].id;
				logger.trace( 'requestHandler.archivePatch: archiving patch id >' + id + '< ' );
				connection.query(database.queries.DBQ022, [id], function (error, info) {
					if( error ) throw({name: "DB Error", message: error.toString()});
					logger.trace('requestHandler.archivePatch: updated with code: ' + info.insertId );
					logger.trace('requestHandler.archivePatch: update addtional info - Affected rows = ' + info.affectedRows + ' message: ' + info.message );
					logger.trace('requestHandler.archivePatch: second query: pending counter value: ' + g_pending );
					g_pending--;
					if( g_pending == 0 ) {
						resp.code = info.insertId;
						resp.message = info.message;
						res.writeHead(200, {
							'Content-Type': 'text/plain'
						});
						res.write('{"support_data": { "feed": { "title":"support data", "entries":');
						res.write(JSON.stringify(resp));
						res.end('}},"responseDetails":null,"responseStatus":200}');
						logger.trace('requestHandler.archivePatch: response object flushed to client' );
						database.tools.closeConnection();
					}
				});
			}
			if( rows.length == 0 ) {
				logger.trace('requestHandler.archivePatch: no patch archived.' );
				resp.code = "1001";
				resp.message = "no patch archived";
				res.writeHead(200, {
					'Content-Type': 'text/plain'
				});
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(resp));
				res.end('}},"responseDetails":null,"responseStatus":200}');
				logger.trace('requestHandler.archivePatch: response object flushed to client' );
			}
		});
	} 
	catch(e) {
		logger.error(e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>


function archiveCase( callback, dataObj, res ) {
// <<<
	var fileText;
	var data;
	var details;
	var d = new Date();
	var resp = {};

	try {
		data = JSON.parse(dataObj);
		logger.trace('requestHandler.archiveCase: (' + data.caseNo + ') ' );
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ021, [data.caseNo], function (error, info) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			logger.trace('requestHandler.archiveCase: updated with code: ' + info.insertId );
			logger.trace('requestHandler.archiveCase: update addtional info - Affected rows = ' + info.affectedRows + ' message: ' + info.message );
			resp.code = info.insertId;
			resp.message = info.message;
			resp.code = "1000";
			resp.message = "OK";
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			if( callback ) {
				res.write( callback + '(' );
			}
			res.write('{"support_data": { "feed": { "title":"support data", "entries":');
			res.write(JSON.stringify(resp));
			res.write('}},"responseDetails":null,"responseStatus":200}');
			if( callback ) {
				res.end(')');
			} else {
				res.end();
			}
			logger.trace('requestHandler.save: response object flushed to client' );
			database.tools.closeConnection();
		});
	} 
	catch(e) {
		logger.error(e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>

function save_to_file( callback, dataObj, res ) {
// <<<
	var fileText;
	var data;
	var d = new Date();

	try {
		data = JSON.parse(dataObj);
		data.caseTxt = database.tools.toLocalDate(d) + ' - ' + data.caseTxt;
		logger.trace('requestHandler.save: (' + data.caseId + ') ' + data.caseNo + ": " + data.caseTxt );
		if( typeof data.caseNo != 'string' ) throw( { name: 'Case Number Invalid', message: 'The case number is invalid or too complex. Use digits only' } );
		fileText = data.caseNo + ':' + data.caseTxt + "\n" ;
		fs.appendFile('/tmp/m.itsm.status', fileText, function (err) {
  			if (err) throw err;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
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


function insertCase( callback, dataObj, res ) {
// <<<
	var fileText;
	var data;
	var details;
	var resp = {};

	try {
		data = JSON.parse(dataObj);
		logger.trace('requestHandler.newCase: >' + data.caseNo + '< >' + data.caseSubject + '<' );
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ005, [data.caseNo], function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			if( rows.length > 0 ) {
				resp.code = 0;
				resp.message = "This case is already inserted";
				res.writeHead(404, {
					'Content-Type': 'text/plain'
				});
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(resp));
				res.end('}},"responseDetails":null,"responseStatus":404}');
				logger.trace('requestHandler.newPatch: response object flushed to client' );
				database.tools.closeConnection();
			} else {
				data.caseNo = data.caseNo * 1;
				if( typeof data.caseNo != 'number' ) throw( { name: 'Case Number Invalid', message: 'The case number is empty or not a decimal number. Use digits only' } );
				connection.query(database.queries.DBQ019, [data.caseNo, data.caseSubject], function (error, info) {
					if( error ) throw({name: "DB Error", message: error.toString()});
					logger.trace('requestHandler.newCase: inserted with code: ' + info.insertId );
					logger.trace('requestHandler.newCase: insert addtional info - Affected rows = ' + info.affectedRows + ' message: ' + info.message );
					resp.code = info.insertId;
					resp.message = info.message;
					res.writeHead(200, {
						'Content-Type': 'text/plain'
					});
					res.write('{"support_data": { "feed": { "title":"support data", "entries":');
					res.write(JSON.stringify(resp));
					res.end('}},"responseDetails":null,"responseStatus":200}');
					logger.trace('requestHandler.newPatch: response object flushed to client' );
					database.tools.closeConnection();
				});
			}
		});
	} 
	catch(e) {
		logger.error(e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>


function insertCaseFull( callback, dataObj, res ) {
// <<<
	var fileText;
	var data;
	var details;
	var resp = {};

	try {
		data = JSON.parse(dataObj);
		data.caseStart = database.tools.toDBDate(database.tools.parseDate(data.caseStart));
 		logger.trace('requestHandler.newCase full insert ----------------');
		logger.trace('    caseNo:' + data.caseNo );
		logger.trace('    caseSubject:' + data.caseSubject );
		logger.trace('    caseStatus:' + data.caseStatus );
		logger.trace('    caseDetails:' + data.caseDetails );
		logger.trace('    caseStart:' + data.caseStart );
		logger.trace('    caseOwner:' + data.caseOwner );
		logger.trace('    caseActive:' + data.caseActive );
		var connection = database.tools.getConnection();

		connection.query(database.queries.DBQ005, [data.caseNo], function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			if( rows.length > 0 ) {
				resp.code = 0;
				resp.message = "This case is already inserted";
				res.writeHead(200, {
					'Content-Type': 'text/plain'
				});
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(resp));
				res.end('}},"responseDetails":null,"responseStatus":200}');
				logger.trace('requestHandler.newPatch: response object flushed to client' );
				database.tools.closeConnection();
			} else {
				connection.query(database.queries.DBQ020, [data.caseNo, data.caseSubject, data.caseStatus, data.caseDetails, data.caseStart, data.caseOwner, data.caseActive] , function (error, info) {
					if( error ) throw({name: "DB Error", message: error.toString()});
					logger.trace('requestHandler.newCase: inserted with code: ' + info.insertId );
					logger.trace('requestHandler.newCase: insert addtional info - Affected rows = ' + info.affectedRows + ' message: ' + info.message );
					resp.code = info.insertId;
					resp.message = info.message;
					res.writeHead(200, {
						'Content-Type': 'text/plain'
					});
					res.write('{"support_data": { "feed": { "title":"support data", "entries":');
					res.write(JSON.stringify(resp));
					res.end('}},"responseDetails":null,"responseStatus":200}');
					logger.trace('requestHandler.newPatch: response object flushed to client' );
					database.tools.closeConnection();
				});
			}
		});
	} 
	catch(e) {
		logger.error(e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>


function newPatch( callback, dataObj, res ) {
// <<<
	var fileText;
	var data;
	var details;
	var resp = {};

	try {
		data = JSON.parse(dataObj);
		logger.trace('requestHandler.newPatch: (' + data.patchName + ') ' );
		if( typeof data.patchName != 'string' ) throw( { name: 'Patch Name Invalid', message: 'The patch name is empty or not a string. Use string only' } );
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ012, [data.patchName], function (error, info) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			logger.trace('requestHandler.newPatch: inserted with code: ' + info.insertId );
			logger.trace('requestHandler.newPatch: insert addtional info - Affected rows = ' + info.affectedRows + ' message: ' + info.message );
			resp.code = info.insertId;
			resp.message = info.message;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.write( callback + '(' );
			res.write('{"support_data": { "feed": { "title":"support data", "entries":');
			res.write(JSON.stringify(resp));
			res.write('}},"responseDetails":null,"responseStatus":200}');
			res.end(')');
			logger.trace('requestHandler.newPatch: response object flushed to client' );
			database.tools.closeConnection();
		});
	} 
	catch(e) {
		logger.error(e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>


function updatePatch( callback, dataObj, res ) {
// <<<
	var fileText;
	var data;
	var details;
	var resp = {};

	try {
		data = JSON.parse(dataObj);
		logger.trace('requestHandler.updatePatch: (' + data.patchId + ') ' + data.patchETA + ": " + data.patchStatus );
		if( typeof data.patchId != 'string' ) throw( { name: 'Patch Code Invalid', message: 'The patch number is invalid or too complex. Use digits only' } );
		data.patchETA = database.tools.toDBDate(database.tools.parseDate(data.patchETA));
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ013, [data.patchETA, data.patchStatus, data.patchId], function (error, info) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			logger.trace('requestHandler.updatePatch: update done. Affected rows = ' + info.affectedRows + ' message: ' + info.message );
			resp.code = info.affectedRows;
			resp.message = info.message;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.write( callback + '(' );
			res.write('{"support_data": { "feed": { "title":"support data", "entries":');
			res.write(JSON.stringify(resp));
			res.write('}},"responseDetails":null,"responseStatus":200}');
			res.end(')');
			logger.trace('requestHandler.updatePatch: response object flushed to client' );
			database.tools.closeConnection();
		});
	} 
	catch(e) {
		logger.error(e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>


function updateProject( callback, dataObj, res ) {
// <<<
	var fileText;
	var data;
	var details;
	var resp = {};

	try {
		data = JSON.parse(dataObj);
		data.caseId = database.tools.filter( data.caseId );
		logger.trace('requestHandler.updateCase: (' + data.caseId + ') - ' + data.caseNo + ' with project >' + data.projectId + '<' );
		if( ! data.caseId  ) throw( { name: 'Case Code Invalid', message: 'The case number is invalid or too complex. Use digits only' } );
		if( ! data.projectId  ) throw( { name: 'Project Code Invalid', message: 'The project number is invalid or too complex. Use digits only' } );
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ018, [data.projectId, data.caseId], function (error, info) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			logger.trace('requestHandler.updatePatch: update done. Affected rows = ' + info.affectedRows + ' message: ' + info.message );
			resp.code = info.affectedRows;
			resp.message = info.message;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.write( callback + '(' );
			res.write('{"support_data": { "feed": { "title":"support data", "entries":');
			res.write(JSON.stringify(resp));
			res.write('}},"responseDetails":null,"responseStatus":200}');
			res.end(')');
			logger.trace('requestHandler.updatePatch: response object flushed to client' );
			database.tools.closeConnection();
		});
	} 
	catch(e) {
		logger.error(e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>


function updateCaseJira( callback, dataObj, res ) {
// <<<
	var fileText;
	var data;
	var details;
	var resp = {};

	try {
		data = JSON.parse(dataObj);
		logger.trace('requestHandler.updateCaseJira - Case: ' + data.caseNo + ' with Jira >' + data.jiraId + '<' );
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ025, [data.jiraId, data.caseNo], function (error, info) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			logger.trace('requestHandler.updateCaseStatus: update done. Affected rows = ' + info.affectedRows + ' message: ' + info.message );
			resp.code = info.affectedRows;
			resp.message = info.message;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			if( callback ) {
				res.write( callback + '(' );
			}
			res.write('{"support_data": { "feed": { "title":"support data", "entries":');
			res.write(JSON.stringify(resp));
			res.write('}},"responseDetails":null,"responseStatus":200}');
			if( callback ) {
				res.end(')');
			} else {
				res.end();
			}
			logger.trace('requestHandler.updateCaseJira: response object flushed to client' );
			database.tools.closeConnection();
		});
	} 
	catch(e) {
		logger.error(e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>


function getAllCases( callback, dataObj, res ) {
// <<<
	try {
		logger.trace('requestHandler.getAllCases' );
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ027, function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			logger.trace('requestHandler:getAllCases found >' + rows.length + '< cases' );
			if( typeof(callback) != "undefined" ) {
				res.write( callback + '(' );
			}
			res.write('{"support_data": { "feed": { "title":"support data", "entries":');
			res.write(JSON.stringify(rows));
			res.write('}},"responseDetails":null,"responseStatus":200}');
			if( typeof(callback) != "undefined" ) {
				res.end(')');
			} else {
				res.end();
			}
			logger.trace('requestHandler.getAllPages: response object flushed to client' );
			database.tools.closeConnection();
		});
	} 
	catch(e) {
		logger.error(e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
		database.tools.closeConnection();
	}
}
// >>>


function updateCaseStatus( callback, dataObj, res ) {
// <<<
	var fileText;
	var data;
	var details;
	var resp = {};

	try {
		data = JSON.parse(dataObj);
		logger.trace('requestHandler.updateCaseStatus: ' + data.caseNo + ' with status >' + data.caseStatus + '<' );
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ024, [data.caseStatus, data.caseNo], function (error, info) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			logger.trace('requestHandler.updateCaseStatus: update done. Affected rows = ' + info.affectedRows + ' message: ' + info.message );
			resp.code = info.affectedRows;
			resp.message = info.message;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			if( callback ) {
				res.write( callback + '(' );
			}
			res.write('{"support_data": { "feed": { "title":"support data", "entries":');
			res.write(JSON.stringify(resp));
			res.write('}},"responseDetails":null,"responseStatus":200}');
			if( callback ) {
				res.end(')');
			} else {
				res.end();
			}
			logger.trace('requestHandler.updateCaseStatus: response object flushed to client' );
			database.tools.closeConnection();
		});
	} 
	catch(e) {
		logger.error(e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>
//


function itsmOverview( callback, empty, res ) {
// <<<
	var dbq;
	var reply = [];
	reply[0] = {};
	logger.trace('requestHandler.itsmOverview ' );
	try {
		logger.trace('requestHandler.itsmOverview: constructing descriptor file' );
		var connection = database.tools.getConnection();
		connection.query(database.queries.DBQ032, function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			reply[0].case_total = rows[0].count;
			connection.query(database.queries.DBQ033, 7, function( error, rows, fields ) {
				if( error ) throw({name: "DB Error", message: error.toString()});
				reply[0].case_opened_week_count = rows[0].count;
				connection.query(database.queries.DBQ034, 7, function( error, rows, fields ) {
					if( error ) throw({name: "DB Error", message: error.toString()});
					reply[0].case_closed_week_count = rows[0].count;
					reply[0].case_closed_week_avg = rows[0].average;
					connection.query(database.queries.DBQ033, 31, function( error, rows, fields ) {
						if( error ) throw({name: "DB Error", message: error.toString()});
						reply[0].case_opened_month_count = rows[0].count;
						connection.query(database.queries.DBQ034, 31, function( error, rows, fields ) {
							if( error ) throw({name: "DB Error", message: error.toString()});
							reply[0].case_closed_month_count = rows[0].count;
							reply[0].case_closed_month_avg = rows[0].average;
							connection.query(database.queries.DBQ035, function( error, rows, fields ) {
								if( error ) throw({name: "DB Error", message: error.toString()});
								reply[0].patches_total = rows[0].count;
								res.writeHead(200, {
									'Content-Type': 'x-application/json'
								});
								if( typeof(callback) != "undefined" ) {
									res.write( callback + '(' );
								}
								res.write('{"support_data": { "feed": { "title":"support data", "entries":');
								res.write(JSON.stringify(reply));
								res.write('}},"responseDetails":null,"responseStatus":200}');
								if( typeof(callback) != "undefined" ) {
									res.end(')');
								} else {
									res.end();
								}
								database.tools.closeConnection();
							});
						});
					});
				});
			});
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + ": " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>


function getFeed( callback, list, res ) {
// <<<
	logger.trace('requestHandler.getFeed: requested list: ' + list );
	var R = {};
	R.support_data = {};
	R.support_data.feed = {};
	R.support_data.feed.title = "support data";
	R.support_data.feed.entries = [];

	try {
		var listObj = JSON.parse(list);
		var connection = database.tools.getConnection();

		// <<< -----> 1st level v
		R.support_data.feed.entries[0] = {};
		R.support_data.feed.entries[0].icon = "resources/images/iClock.png";
		R.support_data.feed.entries[0].description = listObj.entries[0].dateStr;
		R.support_data.feed.entries[0].support_data = {};
		R.support_data.feed.entries[0].support_data.feed = {};
		R.support_data.feed.entries[0].support_data.feed.title = "support data";
		R.support_data.feed.entries[0].support_data.feed.entries = [];

		if( listObj.entries[0].searchStr.length == 0 ) 
			listObj.entries[0].searchStr= "999999999"; // set non-null but non-existent string.
		var query = database.queries.DBQ036a + listObj.entries[0].searchStr + database.queries.DBQ036b;
		connection.query(query, function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error});
			// Add terminators (leaf property) in the generated list and
			// process details. Convert the line breaks into HTML markup.
			logger.trace( 'requestHandler: send processing list of cases long >' + rows.length + '<' );
			R.support_data.feed.entries[0].support_data.feed.entries = rows;
			connection.query(database.queries.DBQ008, function (error, rows, fields) {
				for ( var iterator in R.support_data.feed.entries[0].support_data.feed.entries ) {
					R.support_data.feed.entries[0].support_data.feed.entries[iterator].icon = "resources/images/iFeed3.png";
					R.support_data.feed.entries[0].support_data.feed.entries[iterator].description = iterator + ': ' + R.support_data.feed.entries[0].support_data.feed.entries[iterator].description;
					R.support_data.feed.entries[0].support_data.feed.entries[iterator].leaf="true";
					R.support_data.feed.entries[0].support_data.feed.entries[iterator].details = database.tools.encodeHTML( R.support_data.feed.entries[0].support_data.feed.entries[iterator].details );
					R.support_data.feed.entries[0].support_data.feed.entries[iterator].patches = "Patch: ";
					for ( var iter in rows ) {
						if( R.support_data.feed.entries[0].support_data.feed.entries[iterator].id != rows[iter].id ) continue; 
						logger.trace( 'requestHandler: send found patch entry (' + rows[iter].patch + ') for case (' + R.support_data.feed.entries[0].support_data.feed.entries[iterator].case + ')' );
						R.support_data.feed.entries[0].support_data.feed.entries[iterator].patches += rows[iter].patch;
						R.support_data.feed.entries[0].support_data.feed.entries[iterator].patches += ", ";
					}
					R.support_data.feed.entries[0].support_data.feed.entries[iterator].page =  listObj.entries[0].dateStr;
				}
				// >>>

				// <<< -----> 2nd level v
				R.support_data.feed.entries[1] = {};
				R.support_data.feed.entries[1].icon = "resources/images/iCalendar2.png";
				R.support_data.feed.entries[1].description = listObj.entries[1].dateStr;
				R.support_data.feed.entries[1].support_data = {};
				R.support_data.feed.entries[1].support_data.feed = {};
				R.support_data.feed.entries[1].support_data.feed.title = "support data";
				R.support_data.feed.entries[1].support_data.feed.entries = [];
		
				if( listObj.entries[1].searchStr.length == 0 ) 
					listObj.entries[1].searchStr= "999999999"; // set non-null but non-existent string.
				var query = database.queries.DBQ036a + listObj.entries[1].searchStr + database.queries.DBQ036b;
				connection.query(query, function (error, rows, fields) {
					if( error ) throw({name: "DB Error", message: error});
					// Add terminators (leaf property) in the generated list and
					// process details. Convert the line breaks into HTML markup.
					logger.trace( 'requestHandler: send processing list of cases long >' + rows.length + '<' );
					R.support_data.feed.entries[1].support_data.feed.entries = rows;
					connection.query(database.queries.DBQ008, function (error, rows, fields) {
						for ( var iterator in R.support_data.feed.entries[1].support_data.feed.entries ) {
							R.support_data.feed.entries[1].support_data.feed.entries[iterator].icon = "resources/images/iFeed3.png";
							R.support_data.feed.entries[1].support_data.feed.entries[iterator].description = iterator + ': ' + R.support_data.feed.entries[1].support_data.feed.entries[iterator].description;
							R.support_data.feed.entries[1].support_data.feed.entries[iterator].leaf="true";
							R.support_data.feed.entries[1].support_data.feed.entries[iterator].details = database.tools.encodeHTML( R.support_data.feed.entries[1].support_data.feed.entries[iterator].details );
							R.support_data.feed.entries[1].support_data.feed.entries[iterator].patches = "Patch: ";
							for ( var iter in rows ) {
								if( R.support_data.feed.entries[1].support_data.feed.entries[iterator].id != rows[iter].id ) continue; 
								logger.trace( 'requestHandler: send found patch entry (' + rows[iter].patch + ') for case (' + R.support_data.feed.entries[1].support_data.feed.entries[iterator].case + ')' );
								R.support_data.feed.entries[1].support_data.feed.entries[iterator].patches += rows[iter].patch;
								R.support_data.feed.entries[1].support_data.feed.entries[iterator].patches += ", ";
							}
							R.support_data.feed.entries[1].support_data.feed.entries[iterator].id =  R.support_data.feed.entries[1].support_data.feed.entries[iterator].id | 0x4000;  
						}
						// >>>

						// <<< -----> 3rd level v
						R.support_data.feed.entries[2] = {};
						R.support_data.feed.entries[2].icon = "resources/images/iCalendar2.png";
						R.support_data.feed.entries[2].description = listObj.entries[2].dateStr;
						R.support_data.feed.entries[2].support_data = {};
						R.support_data.feed.entries[2].support_data.feed = {};
						R.support_data.feed.entries[2].support_data.feed.title = "support data";
						R.support_data.feed.entries[2].support_data.feed.entries = [];
				
						if( listObj.entries[2].searchStr.length == 0 ) 
							listObj.entries[2].searchStr= "999999999"; // set non-null but non-existent string.
						var query = database.queries.DBQ036a + listObj.entries[2].searchStr + database.queries.DBQ036b;
						connection.query(query, function (error, rows, fields) {
							if( error ) throw({name: "DB Error", message: error});
							// Add terminators (leaf property) in the generated list and
							// process details. Convert the line breaks into HTML markup.
							logger.trace( 'requestHandler: send processing list of cases long >' + rows.length + '<' );
							R.support_data.feed.entries[2].support_data.feed.entries = rows;
							connection.query(database.queries.DBQ008, function (error, rows, fields) {
								for ( var iterator in R.support_data.feed.entries[2].support_data.feed.entries ) {
									R.support_data.feed.entries[2].support_data.feed.entries[iterator].icon = "resources/images/iFeed3.png";
									R.support_data.feed.entries[2].support_data.feed.entries[iterator].description = iterator + ': ' + R.support_data.feed.entries[2].support_data.feed.entries[iterator].description;
									R.support_data.feed.entries[2].support_data.feed.entries[iterator].leaf="true";
									R.support_data.feed.entries[2].support_data.feed.entries[iterator].details = database.tools.encodeHTML( R.support_data.feed.entries[2].support_data.feed.entries[iterator].details );
									R.support_data.feed.entries[2].support_data.feed.entries[iterator].patches = "Patch: ";
									for ( var iter in rows ) {
										if( R.support_data.feed.entries[2].support_data.feed.entries[iterator].id != rows[iter].id ) continue; 
										logger.trace( 'requestHandler: send found patch entry (' + rows[iter].patch + ') for case (' + R.support_data.feed.entries[2].support_data.feed.entries[iterator].case + ')' );
										R.support_data.feed.entries[2].support_data.feed.entries[iterator].patches += rows[iter].patch;
										R.support_data.feed.entries[2].support_data.feed.entries[iterator].patches += ", ";
									}
									R.support_data.feed.entries[2].support_data.feed.entries[iterator].id =  R.support_data.feed.entries[2].support_data.feed.entries[iterator].id | 0x8000;  
								}
								// >>>

								// <<< -----> 4th level v
								R.support_data.feed.entries[3] = {};
								R.support_data.feed.entries[3].icon = "resources/images/iCalendar2.png";
								R.support_data.feed.entries[3].description = listObj.entries[3].dateStr;
								R.support_data.feed.entries[3].support_data = {};
								R.support_data.feed.entries[3].support_data.feed = {};
								R.support_data.feed.entries[3].support_data.feed.title = "support data";
								R.support_data.feed.entries[3].support_data.feed.entries = [];
						
								if( listObj.entries[2].searchStr.length == 0 ) 
									listObj.entries[2].searchStr= "999999999"; // set non-null but non-existent string.
								var query = database.queries.DBQ036a + listObj.entries[3].searchStr + database.queries.DBQ036b;
								connection.query(query, function (error, rows, fields) {
									if( error ) throw({name: "DB Error", message: error});
									// Add terminators (leaf property) in the generated list and
									// process details. Convert the line breaks into HTML markup.
									logger.trace( 'requestHandler: send processing list of cases long >' + rows.length + '<' );
									R.support_data.feed.entries[3].support_data.feed.entries = rows;
									connection.query(database.queries.DBQ008, function (error, rows, fields) {
										for ( var iterator in R.support_data.feed.entries[3].support_data.feed.entries ) {
											R.support_data.feed.entries[3].support_data.feed.entries[iterator].icon = "resources/images/iFeed3.png";
											R.support_data.feed.entries[3].support_data.feed.entries[iterator].description = iterator + ': ' + R.support_data.feed.entries[3].support_data.feed.entries[iterator].description;
											R.support_data.feed.entries[3].support_data.feed.entries[iterator].leaf="true";
											R.support_data.feed.entries[3].support_data.feed.entries[iterator].details = database.tools.encodeHTML( R.support_data.feed.entries[3].support_data.feed.entries[iterator].details );
											R.support_data.feed.entries[3].support_data.feed.entries[iterator].patches = "Patch: ";
											for ( var iter in rows ) {
												if( R.support_data.feed.entries[3].support_data.feed.entries[iterator].id != rows[iter].id ) continue; 
												logger.trace( 'requestHandler: send found patch entry (' + rows[iter].patch + ') for case (' + R.support_data.feed.entries[3].support_data.feed.entries[iterator].case + ')' );
												R.support_data.feed.entries[3].support_data.feed.entries[iterator].patches += rows[iter].patch;
												R.support_data.feed.entries[3].support_data.feed.entries[iterator].patches += ", ";
											}
											R.support_data.feed.entries[3].support_data.feed.entries[iterator].id =  R.support_data.feed.entries[3].support_data.feed.entries[iterator].id | 0xC000;  
										}
										// >>>
// ----> -----> ----> ----> -----> ----> ----> -----> ----> ----> -----> ---->

										R.responseDetails = null;
										R.responseStatus = 200;

										res.writeHead(200, {
											'Content-Type': 'x-application/json'
										});
										if( callback )
											res.write( callback + '(' );
										res.write(JSON.stringify(R));
										if( callback )
											res.write(')');
										res.end();

										logger.trace('requestHandler.getFeed: response object flushed to client' );
										database.tools.closeConnection();
									});
								});
							});
						});
					});
				});
			});
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
} // >>>


function getFeed_backup( callback, list, res ) {
// <<<
	logger.trace('requestHandler.getFeed: requested list: ' + list );

	try {
		var listObj = JSON.parse(list);
		var connection = database.tools.getConnection();

		res.writeHead(200, {
			'Content-Type': 'x-application/json'
		});
		if( callback )
			res.write( callback + '(' );
		res.write('{"support_data": { "feed": { "title":"support data", "entries":[');
		res.write('{"icon":"resources/images/iCalendar.png","description":"' + listObj.entries[0].dateStr + '","support_data":');

		var query = database.queries.DBQ036a + listObj.entries[0].searchStr + database.queries.DBQ036b;
		connection.query(query, function (error, rows, fields) {
			if( error ) throw({name: "DB Error", message: error.toString()});
			// Add terminators (leaf property) in the generated list and
			// process details. Convert the line breaks into HTML markup.
			logger.trace( 'requestHandler: send processing list of cases long >' + rows.length + '<' );
			cases = rows;
			connection.query(database.queries.DBQ008, function (error, rows, fields) {
				for ( var iterator in cases ) {
					cases[iterator].icon = "resources/images/iFeed3.png";
					cases[iterator].description = iterator + ': ' + cases[iterator].description;
					cases[iterator].leaf="true";
					cases[iterator].details = database.tools.encodeHTML( cases[iterator].details );
					cases[iterator].patches = "Patch: ";
					for ( var iter in rows ) {
						if( cases[iterator].id != rows[iter].id ) continue; 
						logger.trace( 'requestHandler: send found patch entry (' + rows[iter].patch + ') for case (' + cases[iterator].case + ')' );
						cases[iterator].patches += rows[iter].patch;
						cases[iterator].patches += ", ";
					}
				}
//				if( callback )
//					res.write( callback + '(' );
//				res.write('{"support_data": { "feed": { "title":"support data", "entries":');

				res.write('{ "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(cases));
				res.write('}}}]');

				res.write('}},"responseDetails":null,"responseStatus":200}');
				if( callback )
					res.write(')');
				res.end();
				logger.trace('requestHandler.getFeed: response object flushed to client' );
				database.tools.closeConnection();
			});
		});
	}
	catch(e) {
		logger.error("Exception: " + e.name + " - " + e.message );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
} // >>>



exports.search = search;
exports.describe = describe;
exports.send = send;
exports.save = save;
exports.unlink = unlink;
exports.queryDB = queryDB;
exports.testDB = testDB;
exports.listPatches = listPatches;
exports.listProjects = listProjects;
exports.linkPatch = linkPatch;
exports.newPatch = newPatch;
exports.updatePatch = updatePatch;
exports.updateCaseStatus = updateCaseStatus;
exports.createProject = createProject;
exports.updateProject = updateProject;
exports.insertCase = insertCase;
exports.insertCaseFull = insertCaseFull;
exports.archiveCase = archiveCase;
exports.archivePatch = archivePatch;
exports.updateCaseJira = updateCaseJira;
exports.getAllCases = getAllCases;
exports.sendUnarchived=sendUnarchived;
exports.itsmOverview=itsmOverview;
exports.favorites=favorites;

exports.getFeed=getFeed;
