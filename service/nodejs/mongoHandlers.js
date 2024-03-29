var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var sql = require("./requestHandlers");

/*
var format = require('util').format;

var url = format("mongodb://%s:%s@%s:%s/%s"
    , process.env.OPENSHIFT_MONGODB_DB_USERNAME
    , process.env.OPENSHIFT_MONGODB_DB_PASSWORD
    , process.env.OPENSHIFT_MONGODB_DB_HOST
    , parseInt(process.env.OPENSHIFT_MONGODB_DB_PORT)
    , process.env.OPENSHIFT_APP_NAME)

      collection.find({}, {limit:10}).toArray(function(err, docs) {
        console.dir(docs);
      });
 
*/

function getDatePattern( date, num ) {
// <<<

	var mon = "";
	var year = "";
	var pattern = "01.2013";
	if( "[object Date]" == Object.prototype.toString.call(date) ) {
		var mon = date.getMonth() + 1;
		var year = date.getYear() + 1900;
	} else {
		console.error( "invalid Date object" );
		return pattern;
	}

	mon = mon - num;
	if( mon < 1 ) {
		mon += 12;
		year -= 1;
	}
	pattern = (mon).toString() + "." + (year).toString() + " ";
	return pattern;
} // >>>

function removeMailMDB( callback, data, res ) {
// <<<
	var r = {};
	var obj = JSON.parse(data);

	try {
		// Set up the connection to the local db
		var mongoclient = new MongoClient(new Server("localhost", 27017, {native_parser: true}));

		// Open the connection to the server
		mongoclient.open(function(err, mongoclient) {

			// Get the first db and do an update document on it
			var db = mongoclient.db("itsm");
			var collection = db.collection('test');
	
      	collection.remove({"caseNo":obj.caseNo}, {w:1}, function(err, docs) {
				if(err) throw err;
				res.writeHead(200, {
					'Content-Type': 'x-application/json'
				});

				r.code = 200;
				r.message = "OK";
	
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(r));
				res.write('}},"responseDetails":null,"responseStatus":200}');
				res.end();
				mongoclient.close();
			});  
		});
	}
	catch(e) {
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>

function insertMailMDB( callback, data, res ) {
// <<<
	var r = {};
	var obj = JSON.parse(data);

	try {
		MongoClient.connect('mongodb://localhost:27017/itsm', function(err, db) {
			if(err) throw err;
	
			console.log("connected");
	
			var collection = db.collection('test');
	
			collection.insert(obj, {w:1}, function(err, result) {
				if(err) throw err;
				res.writeHead(200, {
					'Content-Type': 'x-application/json'
				});

				r.code = 200;
				r.message = "OK";
	
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(r));
				res.write('}},"responseDetails":null,"responseStatus":200}');
				res.end();
			});  
		});
	}
	catch(e) {
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>

function insertMailMDBEx( callback, data, res ) {
// <<<
	var r = {};
	var obj = JSON.parse(data);

	// Set up the connection to the local db
	var mongoclient = new MongoClient(new Server("localhost", 27017, {native_parser: true}));

	// Open the connection to the server
	mongoclient.open(function(err, mongoclient) {

		// Get the first db and do an update document on it
		var db = mongoclient.db("itsm");
		var collection = db.collection('test');
		collection.insert(obj, {w:1}, function(err, result) {
			if(err) throw err;
			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});

			r.code = 200;
			r.message = "OK";
	
			res.write('{"support_data": { "feed": { "title":"support data", "entries":');
			res.write(JSON.stringify(r));
			res.write('}},"responseDetails":null,"responseStatus":200}');
			res.end();
			// Close the connection
			mongoclient.close();
		});
	});
}
// >>>


function testMDB( callback, data, res ) {
// <<<
	MongoClient.connect('mongodb://localhost:27017/itsm', function(err, db) {
		if(err) throw err;

		console.log("connected");

		var collection = db.collection('test');
		var docs = [{mykey:1}, {mykey:2}, {mykey:3}];

		collection.insert(docs, {w:1}, function(err, result) {
			collection.find().toArray(function(err, items) {});

			var stream = collection.find({mykey:{$ne:4}}).stream();

			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});

			res.write('{"support_data": { "feed": { "title":"support data", "entries":[');

			stream.on("data", function(item) {
				console.log("find: ");
				console.log(item);
				res.write(JSON.stringify(item));
				res.write(',');
			});

			stream.on("end", function() { 
				res.write('{}]}},"responseDetails":null,"responseStatus":200}');
				res.end();
				console.log("end event");
			});

			collection.findOne({mykey:2}, function(err, item) { console.log("findOne: "); console.log(item); });
		});  
	});
}
// >>>

function cursorMDB( callback, data, res ) {
// <<<
	try {
		MongoClient.connect('mongodb://localhost:27017/itsm', function(err, db) {
			if(err) throw err;

			var collection = db.collection('test');

      	collection.find({mykey:{$ne:4}}, {limit:100}).toArray(function(err, docs) {
				res.writeHead(200, {
					'Content-Type': 'x-application/json'
				});
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');

				res.write(JSON.stringify(docs));

				res.write('}},"responseDetails":null,"responseStatus":200}');
				res.end();
      	});
		});
	}
	catch(e) {
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>

function retrieveEmailsFromMDB_deprecated( callback, data, res ) {
// <<<
	try {
		dataObj = JSON.parse(data);
		MongoClient.connect('mongodb://localhost:27017/itsm', function(err, db) {
			if(err) throw err;

			var collection = db.collection('test');

      	collection.find({"caseNo":dataObj.caseNo}).toArray(function(err, docs) {
				if( err ) throw err;

				for ( var iterator in docs ) {
					docs[iterator].leaf="true";
					docs[iterator].icon="resources/images/iEmail31.png";
					if( typeof( docs[iterator].attachments ) != "undefined" ) {
						if((typeof(docs[iterator].attachments.length ) == "number" ) && ( docs[iterator].attachments.length > 0 )) {
							docs[iterator].icon="resources/images/iEmailAtt31.png";
						}
					}
				}

				res.writeHead(200, {
					'Content-Type': 'x-application/json'
				});
				if( callback )
					res.write( callback + '(' );

				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(docs));
				res.write('}},"responseDetails":null,"responseStatus":200}');

				if( callback )
					res.write(')');

				res.end();
      	});
		});
	}
	catch(e) {
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>

function retrieveEmailsFromMDB( callback, data, res ) {
// <<<
	try {
		dataObj = JSON.parse(data);
		// Set up the connection to the local db
		var mongoclient = new MongoClient(new Server("localhost", 27017, {native_parser: true}));

		// Open the connection to the server
		mongoclient.open(function(err, mongoclient) {

			// Get the first db and do an update document on it
			var db = mongoclient.db("itsm");
			var collection = db.collection('test');
	
	     	collection.find({"caseNo":dataObj.caseNo}).toArray(function(err, docs) {
				if( err ) throw err;
	
				for ( var iterator in docs ) {
					docs[iterator].leaf="true";
					docs[iterator].icon="resources/images/iEmail31.png";
					if( typeof( docs[iterator].attachments ) != "undefined" ) {
						if((typeof(docs[iterator].attachments.length ) == "number" ) && ( docs[iterator].attachments.length > 0 )) {
							docs[iterator].icon="resources/images/iEmailAtt31.png";
						}
					}
				}
	
				res.writeHead(200, {
					'Content-Type': 'x-application/json'
				});
				if( callback )
					res.write( callback + '(' );
	
				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(docs));
				res.write('}},"responseDetails":null,"responseStatus":200}');
	
				if( callback )
					res.write(')');
	
				res.end();
				mongoclient.close();
      	});
		});
	}
	catch(e) {
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>

function retrieveRecentEmailsFromMDB( callback, data, res ) {
// <<<
	try {
		var dataObj = JSON.parse(data);
		var feedInput = {};
		var pattern = "";
		var response = "";
		var t = new Date();
		var day;
		var query;
				
/* <<<
		// Perform basic date calculation (add/subtract days from a date)
		var day = new Date();
		day.setDate(day.getDate() - 7);
		day.toString();
		(day.getMonth()+1).toString();
		(day.getYear()+1900).toString();
>>> */

		feedInput.entries = [];

		// Set up the connection to the local db
		var mongoclient = new MongoClient(new Server("localhost", 27017, {native_parser: true}));

		// Open the connection to the server
		mongoclient.open(function(err, mongoclient) {

			// Get the first db and do an update document on it
			var db = mongoclient.db("itsm");
			var collection = db.collection('test');

/* <<<
			day -= parseInt(dataObj.daysBack); // TODO - debugging
			if( day < 10 ) {
				pattern = "0" + day.toString();
			} else {
				pattern = day.toString();
			}
			pattern = pattern + "." + (t.getMonth()+1).toString() + "." + (t.getYear()+1900).toString();
			var query = { "sentOn": new RegExp('^' + pattern ) };
>>> */

			dataObj.daysBack = dataObj.daysBack * 1;
			if( isNaN(dataObj.daysBack) ) {
				dataObj.daysBack = 0;
			}	
			t.setDate(t.getDate() - dataObj.daysBack);

			if( t.getDay() == 0 )
				t.setDate(t.getDate() - 1);
			if( t.getDay() == 6 )
				t.setDate(t.getDate() - 1);
			day = t.getDate();
			if( day < 10 ) {
				pattern = "0" + day.toString();
			} else {
				pattern = day.toString();
			}
			pattern = pattern + "." + (t.getMonth()+1).toString() + "." + (t.getYear()+1900).toString();
			query = { "sentOn": new RegExp('^' + pattern ) };

			collection.find(query,{'caseNo':1, '_id':0}).toArray(function(err,docs) {
				if( err ) throw err;

				feedInput.entries[0] = {};
				feedInput.entries[0].dateStr = pattern;
				feedInput.entries[0].searchStr = "";

				if( docs && (docs.length) > 0 ) {
					feedInput.entries[0].searchStr = docs[0].caseNo;
					for ( var iterator in docs ) {
						feedInput.entries[0].searchStr = feedInput.entries[0].searchStr + ", " + docs[iterator].caseNo;
					}
				}
				// --------------------- 1 -----------------------------
				t.setDate(t.getDate() - 1);
				if( t.getDay() == 0 )
					t.setDate(t.getDate() - 1);
				if( t.getDay() == 6 )
					t.setDate(t.getDate() - 1);
				day = t.getDate();
				if( day < 10 ) {
					pattern = "0" + day.toString();
				} else {
					pattern = day.toString();
				}
				pattern = pattern + "." + (t.getMonth()+1).toString() + "." + (t.getYear()+1900).toString();
				query = { "sentOn": new RegExp('^' + pattern ) };
		
				collection.find(query,{'caseNo':1, '_id':0}).toArray(function(err,docs) {
					if( err ) throw err;
		
					feedInput.entries[1] = {};
					feedInput.entries[1].dateStr = pattern;
					feedInput.entries[1].searchStr = "";

					if( docs && (docs.length) > 0 ) {
						feedInput.entries[1].searchStr = docs[0].caseNo;
						for ( var iterator in docs ) {
							feedInput.entries[1].searchStr = feedInput.entries[1].searchStr + ", " + docs[iterator].caseNo;
						}
					}
					// --------------------- 2 -----------------------------
					t.setDate(t.getDate()-1);
					if( t.getDay() == 0 )
						t.setDate(t.getDate() - 1);
					if( t.getDay() == 6 )
						t.setDate(t.getDate() - 1);
					day = t.getDate();
					if( day < 10 ) {
						pattern = "0" + day.toString();
					} else {
						pattern = day.toString();
					}
					pattern = pattern + "." + (t.getMonth()+1).toString() + "." + (t.getYear()+1900).toString();
					query = { "sentOn": new RegExp('^' + pattern ) };
			
					collection.find(query,{'caseNo':1, '_id':0}).toArray(function(err,docs) {
						if( err ) throw err;
			
						feedInput.entries[2] = {};
						feedInput.entries[2].dateStr = pattern;
						feedInput.entries[2].searchStr = "";
	
						if( docs && (docs.length) > 0 ) {
							feedInput.entries[2].searchStr = docs[0].caseNo;
							for ( var iterator in docs ) {
								feedInput.entries[2].searchStr = feedInput.entries[2].searchStr + ", " + docs[iterator].caseNo;
							}
						}
						// --------------------- 3 -----------------------------
						t.setDate(t.getDate()-1);
						if( t.getDay() == 0 )
							t.setDate(t.getDate() - 1);
						if( t.getDay() == 6 )
							t.setDate(t.getDate() - 1);
						day = t.getDate();
						if( day < 10 ) {
							pattern = "0" + day.toString();
						} else {
							pattern = day.toString();
						}
						pattern = pattern + "." + (t.getMonth()+1).toString() + "." + (t.getYear()+1900).toString();
						query = { "sentOn": new RegExp('^' + pattern ) };
				
						collection.find(query,{'caseNo':1, '_id':0}).toArray(function(err,docs) {
							if( err ) throw err;
				
							feedInput.entries[3] = {};
							feedInput.entries[3].dateStr = pattern;
							feedInput.entries[3].searchStr = "";

							if( docs && (docs.length) > 0 ) {
								feedInput.entries[3].searchStr = docs[0].caseNo;
								for ( var iterator in docs ) {
									feedInput.entries[3].searchStr = feedInput.entries[3].searchStr + ", " + docs[iterator].caseNo;
								}
							}
							// --------------------- 4 -----------------------------
							t.setDate(t.getDate()-1);
							if( t.getDay() == 0 )
								t.setDate(t.getDate() - 1);
							if( t.getDay() == 6 )
								t.setDate(t.getDate() - 1);
							day = t.getDate();
							if( day < 10 ) {
								pattern = "0" + day.toString();
							} else {
								pattern = day.toString();
							}
							pattern = pattern + "." + (t.getMonth()+1).toString() + "." + (t.getYear()+1900).toString();
							query = { "sentOn": new RegExp('^' + pattern ) };
					
							collection.find(query,{'caseNo':1, '_id':0}).toArray(function(err,docs) {
								if( err ) throw err;
					
								feedInput.entries[4] = {};
								feedInput.entries[4].dateStr = pattern;
								feedInput.entries[4].searchStr = "";
	
								if( docs && (docs.length) > 0 ) {
									feedInput.entries[4].searchStr = docs[0].caseNo;
									for ( var iterator in docs ) {
										feedInput.entries[4].searchStr = feedInput.entries[4].searchStr + ", " + docs[iterator].caseNo;
									}
								}

								pattern = JSON.stringify(feedInput);
								mongoclient.close();
								sql.getFeed( callback, pattern, res );
							});
				     	});
			     	});
		     	});
      	});
		});
	}
	catch(e) {
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>

function retrieveRecentEmailsByAuthorFromMDB( callback, data, res ) {
// <<<
	try {
		var dataObj = JSON.parse(data);
		var feedInput = {};
		var pattern = "";
		var response = "";
		var t = new Date();
		var day;
		var query;
				
/* <<<
		// Perform basic date calculation (add/subtract days from a date)
		var day = new Date();
		day.setDate(day.getDate() - 7);
		day.toString();
		(day.getMonth()+1).toString();
		(day.getYear()+1900).toString();
>>> */

		feedInput.entries = [];

		// Set up the connection to the local db
		var mongoclient = new MongoClient(new Server("localhost", 27017, {native_parser: true}));

		// Open the connection to the server
		mongoclient.open(function(err, mongoclient) {

			// Get the first db and do an update document on it
			var db = mongoclient.db("itsm");
			var collection = db.collection('test');

/* <<<
			day -= parseInt(dataObj.daysBack); // TODO - debugging
			if( day < 10 ) {
				pattern = "0" + day.toString();
			} else {
				pattern = day.toString();
			}
			pattern = pattern + "." + (t.getMonth()+1).toString() + "." + (t.getYear()+1900).toString();
			var query = { "sentOn": new RegExp('^' + pattern ) };
>>> */

//			pattern = (t.getMonth()+1).toString() + "." + (t.getYear()+1900).toString() + " ";
			pattern = getDatePattern( t, 0 );
			query = { "sentOn": new RegExp('^...' + pattern ), "mailSender": new RegExp( dataObj.author) };

			collection.find(query,{'caseNo':1, '_id':0}).toArray(function(err,docs) {
				if( err ) throw err;

				feedInput.entries[0] = {};
				feedInput.entries[0].dateStr = pattern;
				feedInput.entries[0].searchStr = "";

				if( docs && (docs.length) > 0 ) {
					feedInput.entries[0].searchStr = docs[0].caseNo;
					for ( var iterator in docs ) {
						feedInput.entries[0].searchStr = feedInput.entries[0].searchStr + ", " + docs[iterator].caseNo;
					}
				}
				// --------------------- 1 -----------------------------
		
//				pattern = (t.getMonth()).toString() + "." + (t.getYear()+1900).toString() + " ";
				pattern = getDatePattern( t, 1 );
				query = { "sentOn": new RegExp('^...' + pattern ), "mailSender": new RegExp( dataObj.author ) };

				collection.find(query,{'caseNo':1, '_id':0}).toArray(function(err,docs) {
					if( err ) throw err;
		
					feedInput.entries[1] = {};
					feedInput.entries[1].dateStr = pattern;
					feedInput.entries[1].searchStr = "";

					if( docs && (docs.length) > 0 ) {
						feedInput.entries[1].searchStr = docs[0].caseNo;
						for ( var iterator in docs ) {
							feedInput.entries[1].searchStr = feedInput.entries[1].searchStr + ", " + docs[iterator].caseNo;
						}
					}
					// --------------------- 2 -----------------------------
			
//					pattern = (t.getMonth()-1).toString() + "." + (t.getYear()+1900).toString() + " ";
					pattern = getDatePattern( t, 2 );
					query = { "sentOn": new RegExp('^...' + pattern ), "mailSender": new RegExp( dataObj.author ) };

					collection.find(query,{'caseNo':1, '_id':0}).toArray(function(err,docs) {
						if( err ) throw err;
			
						feedInput.entries[2] = {};
						feedInput.entries[2].dateStr = pattern;
						feedInput.entries[2].searchStr = "";
	
						if( docs && (docs.length) > 0 ) {
							feedInput.entries[2].searchStr = docs[0].caseNo;
							for ( var iterator in docs ) {
								feedInput.entries[2].searchStr = feedInput.entries[2].searchStr + ", " + docs[iterator].caseNo;
							}
						}
						// --------------------- 3 -----------------------------

//						pattern = (t.getMonth()-2).toString() + "." + (t.getYear()+1900).toString() + " ";
						pattern = getDatePattern( t, 3 );
						query = { "sentOn": new RegExp('^...' + pattern ), "mailSender": new RegExp( dataObj.author ) };

						collection.find(query,{'caseNo':1, '_id':0}).toArray(function(err,docs) {
							if( err ) throw err;
				
							feedInput.entries[3] = {};
							feedInput.entries[3].dateStr = pattern;
							feedInput.entries[3].searchStr = "";

							if( docs && (docs.length) > 0 ) {
								feedInput.entries[3].searchStr = docs[0].caseNo;
								for ( var iterator in docs ) {
									feedInput.entries[3].searchStr = feedInput.entries[3].searchStr + ", " + docs[iterator].caseNo;
								}
							}
							// --------------------- 4 -----------------------------
					
//							pattern = (t.getMonth()-3).toString() + "." + (t.getYear()+1900).toString() + " ";
							pattern = getDatePattern( t, 4 );
							query = { "sentOn": new RegExp('^...' + pattern ), "mailSender": new RegExp( dataObj.author ) };

							collection.find(query,{'caseNo':1, '_id':0}).toArray(function(err,docs) {
								if( err ) throw err;
					
								feedInput.entries[4] = {};
								feedInput.entries[4].dateStr = pattern;
								feedInput.entries[4].searchStr = "";
	
								if( docs && (docs.length) > 0 ) {
									feedInput.entries[4].searchStr = docs[0].caseNo;
									for ( var iterator in docs ) {
										feedInput.entries[4].searchStr = feedInput.entries[4].searchStr + ", " + docs[iterator].caseNo;
									}
								}

								pattern = JSON.stringify(feedInput);
								mongoclient.close();
								sql.getFeed( callback, pattern, res );
							});
				     	});
			     	});
		     	});
      	});
		});
	}
	catch(e) {
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>

function retrieveEmailCountFromMDB( callback, data, res ) {
// <<<
	var reply = {};
	try {
		dataObj = JSON.parse(data);
		var mongoclient = new MongoClient(new Server("localhost", 27017, {native_parser: true}));

		// Open the connection to the server
		mongoclient.open(function(err, mongoclient) {

			// Get the first db and do an update document on it
			var db = mongoclient.db("itsm");
			var collection = db.collection('test');

      	collection.find({"caseNo":dataObj.caseNo}).count(function(err, docs) {
				if( err ) throw err;

				reply.count = docs;

				res.writeHead(200, {
					'Content-Type': 'x-application/json'
				});
				if( callback ) 
					res.write( callback + '(' );

				res.write('{"support_data": { "feed": { "title":"support data", "entries":');
				res.write(JSON.stringify(reply));
				res.write('}},"responseDetails":null,"responseStatus":200}');

				if( callback )
					res.end(')');
				else
					res.end();
				mongoclient.close();
      	});
		});
	}
	catch(e) {
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>

function selectMDB( callback, data, res ) {
// <<<
	try {
		MongoClient.connect('mongodb://localhost:27017/itsm', function(err, db) {
			if(err) throw err;

			var collection = db.collection('test');

			var stream = collection.find({mykey:{$ne:4}}).stream();

			res.writeHead(200, {
				'Content-Type': 'x-application/json'
			});

			res.write('{"support_data": { "feed": { "title":"support data", "entries":[');

			stream.on("data", function(item) {
//				console.log("find: ");
//				console.log(item);
				res.write(JSON.stringify(item));
				res.write(',');
			});

			stream.on("end", function() { 
				res.write('{"stopper":"last"}]}},"responseDetails":null,"responseStatus":200}');
				res.end();
//				console.log("end event");
			});
		});
	}
	catch(e) {
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}
// >>>

function searchTextInEmailsMDB( callback, data, res ) {
// <<<
	try {
		var query;
		var r = {};
		r.entries = [];

		// Set up the connection to the local db
		var mongoclient = new MongoClient(new Server("localhost", 27017, {native_parser: true}));

		// Open the connection to the server
		mongoclient.open(function(err, mongoclient) {
			try {
				// Get the first db and do an update document on it
				var db = mongoclient.db("itsm");
				var collection = db.collection('test');
				query = { "mailSubject": new RegExp( data, 'i' ) };
				collection.find(query,{'caseNo':1, '_id':0}).toArray(function(err,docs) {
					r.code = 200;
					r.message = "OK";
					r.entries = docs;
					mongoclient.close();
					sql.searchTextDump( callback, JSON.stringify(r), res );
  		    	});
			}
			catch(e) {
				r.code=404;
				r.message = e.message;
				sql.searchTextDump( callback, JSON.stringify(r), res );
			}
      });
	}
	catch(e) {
		r.code=404;
		r.message = e.message;
		sql.searchTextDump( callback, JSON.stringify(r), res );
	}
}
// >>>

function countTodaysFeed( callback, res ) {
// <<<	
	try {
		var feedInput = {};
		var pattern = "";
		var response = "";
		var t = new Date();
		var day;
		var query;
				
		feedInput.entries = [];

		// Set up the connection to the local db
		var mongoclient = new MongoClient(new Server("localhost", 27017, {native_parser: true}));

		// Open the connection to the server
		mongoclient.open(function(err, mongoclient) {

			// Get the first db and do an update document on it
			var db = mongoclient.db("itsm");
			var collection = db.collection('test');

			if( t.getDay() == 0 )
				t.setDate(t.getDate() - 1);
			if( t.getDay() == 6 )
				t.setDate(t.getDate() - 1);
			day = t.getDate();
			if( day < 10 ) {
				pattern = "0" + day.toString();
			} else {
				pattern = day.toString();
			}
			pattern = pattern + "." + (t.getMonth()+1).toString() + "." + (t.getYear()+1900).toString();
			query = { "sentOn": new RegExp('^' + pattern ) };

			collection.find(query,{'caseNo':1, '_id':0}).toArray(function(err,docs) {
				if( err ) throw err;

				var pattern = JSON.stringify(docs);
				mongoclient.close();
				sql.sendCheckpoints( callback, pattern, res );
			});
		});
	}
	catch(e) {
	}
}
// >>>

// <<<
/* 
var Db = require('mongodb').Db
  , Connection = require('mongodb').Connection
  , Server = require('mongodb').Server
  , format = require('util').format;


var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

console.log("Connecting to " + host + ":" + port);

Db.connect(format("mongodb://%s:%s/node-mongo-examples?w=1", host, port), function(err, db) {
  db.dropDatabase(function() {
    // Fetch the collection test
    var collection = db.collection('test');
    // Remove all records in collection if any
    collection.remove(function(err, result) {
      // Insert three records
      collection.insert([{'a':1}, {'a':2}, {'b':3}], {w:1}, function(docs) {
        // Count the number of records
        collection.count(function(err, count) {
          console.log("There are " + count + " records.");
        });
        
        console.log("Printing docs from Cursor Each")
        // Find all records. find() returns a cursor
        // Print each row, each document has an _id field added on insert
        // to override the basic behaviour implement a primary key factory
        // that provides a 12 byte value
        collection.find().each(function(err, doc) {
          if(doc != null) console.log("Doc from Each ");
          console.dir(doc);
        });
        // Cursor has an to array method that reads in all the records to memory
        collection.find().toArray(function(err, docs) {
          console.log("Printing docs from Array")
          docs.forEach(function(doc) {
            console.log("Doc from Array ");
            console.dir(doc);
          });
        });
        
        // Different methods to access records (no printing of the results)
        
        // Locate specific document by key
        collection.find({'a':1}).nextObject(function(err, doc) {            
          console.log("Returned #1 documents");
        });
        
        // Find records sort by 'a', skip 1, limit 2 records
        // Sort can be a single name, array, associate array or ordered hash
        collection.find({}, {'skip':1, 'limit':1, 'sort':'a'}).toArray(function(err, docs) {            
          console.log("Returned #" + docs.length + " documents");
        })          
        
        // Find all records with 'a' > 1, you can also use $lt, $gte or $lte
        collection.find({'a':{'$gt':1}}).toArray(function(err, docs) {
          console.log("Returned #" + docs.length + " documents");
        });
        
        collection.find({'a':{'$gt':1, '$lte':3}}).toArray(function(err, docs) {
          console.log("Returned #" + docs.length + " documents");
        });          
        
        // Find all records with 'a' in a set of values
        collection.find({'a':{'$in':[1,2]}}).toArray(function(err, docs) {
          console.log("Returned #" + docs.length + " documents");
        });          
        
        // Find by regexp
        collection.find({'a':/[1|2]/}).toArray(function(err, docs) {
          console.log("Returned #" + docs.length + " documents");
        });          

        // Print Query explanation
        collection.find({'a':/[1|2]/}).explain(function(err, doc) {
          console.log("-------------------------- Explanation");
          console.dir(doc);
        })

        // Use a hint with a query, hint's can also be store in the collection
        // and will be applied to each query done through the collection.
        // Hint's can also be specified by query which will override the 
        // hint's associated with the collection
        collection.createIndex('a', function(err, indexName) {
          collection.hint = 'a';

          // You will see a different explanation now that the hint was set
          collection.find({'a':/[1|2]/}).explain(function(err, doc) {
            console.log("-------------------------- Explanation");
            console.dir(doc);
          })

          collection.find({'a':/[1|2]/}, {'hint':'a'}).explain(function(err, doc) {
            console.log("-------------------------- Explanation");
            console.dir(doc);
            db.close();
          })
        });    
      });
    });    
  });
});
// >>>
*/

exports.testMDB = testMDB;
exports.selectMDB = selectMDB;
exports.cursorMDB = cursorMDB;
exports.insertMailMDB = insertMailMDBEx;
exports.removeMailMDB = removeMailMDB;
exports.retrieveEmailsFromMDB = retrieveEmailsFromMDB; 
exports.retrieveEmailCountFromMDB = retrieveEmailCountFromMDB;
exports.retrieveRecentEmailsFromMDB = retrieveRecentEmailsFromMDB;
exports.retrieveRecentEmailsByAuthorFromMDB = retrieveRecentEmailsByAuthorFromMDB
exports.searchTextInEmailsMDB = searchTextInEmailsMDB
exports.countTodaysFeed = countTodaysFeed

