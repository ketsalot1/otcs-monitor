
function route(handle, params, res) {
	console.log("router: got routing request");

	var dataName = "";
	var proc = 'send';
	var callback = params['processSupportData'];
	var pattern = params['search'];
	var save = params['save'];
	var otcs = params['otcs'];

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

	/*
	 *	Reflection pattern: assigned in 'itsm.js' object
	 */
	if (typeof handle[proc] === 'function') {
		handle[proc](callback,pattern,res);
	} else {
		console.log("router: No request handler found for incoming request" );
		res.writeHead(404);
		res.end(e.name + ': ' + e.message);
	}
}

exports.route = route;
