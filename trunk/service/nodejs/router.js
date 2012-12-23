
function route(handle, params, res) {
	console.log("router: got routing request");

/* <<<
	var dataName = "";
	var proc = 'send';
	var pattern = params['search'];
	var save = params['save'];
	var otcs = params['otcs'];
>>> */


/* New experiemntal code, requires new structure of incoming request!!  */
	try {
		var callback = params['processSupportData'];
		var cmd = params['cmd'];
		var pars = params['data'];

		if( typeof cmd == 'undefined' ) throw({"name":"Command not available the query"});

		if (typeof handle[cmd] !== 'function') throw({"name":"Unknow command received"});
		handle[cmd](callback,pars,res);
	}
	catch(e) {
		console.log("Exception caught" );
		console.log(e.name);
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}

/* <<<
	if( typeof pattern !== 'undefined' ) { 
		proc = 'search';
	} 
	
	if( typeof save !== 'undefined' ) {
		proc = 'save';
		pattern = { caseNo: params['save'], text: params['text'] };
	}

	if( typeof otcs !== 'undefined' ) {
		proc = 'send';
		pattern = '/tmp/' + params['otcs'] + '.data';
	}

	// Reflection pattern: assigned in 'itsm.js' object
	if (typeof handle[proc] === 'function') {
		handle[proc](callback,pattern,res);
	} else {
		console.log("router: No request handler found for incoming request" );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
>>> */
}

exports.route = route;
