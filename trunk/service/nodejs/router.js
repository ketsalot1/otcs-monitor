
function route(handle, params, res) {
	console.log("router: got routing request");

	var dataName = "";
	var proc = 'send';
	var callback = params['processSupportData'];
	var pattern = params['search'];

	if( typeof pattern !== 'undefined' ) { 
		proc = 'search';
	} else {
		pattern = '/tmp/' + params['otcs'] + '.data';
	}

	if (typeof handle[proc] === 'function') {
		handle[proc](callback,pattern,res);
	} else {
		console.log("router: No request handler found for incoming request" );
	}
}

exports.route = route;
