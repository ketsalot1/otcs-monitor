function route(handle, params, res) {
	console.log("router: got routing request");

	try {
		var callback = params['processSupportData'];

		if( !callback ) {
			callback=params['callback'];
		}
		/* jQuery does not allow to define the name of callback parameter
		 * it is always called 'callback'. Sencha required to specify
		 * the name 
		 */
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
		res.end(e.name);
	}
}

exports.route = route;
