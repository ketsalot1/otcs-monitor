function route(handle, params, res) {
	console.log("router: got routing request");
	var envelop=new RegExp("^.*\\[.*\\]$");
	var idx=new RegExp("\\[.*\\]$");
	var cutter=new RegExp("[a-zA-Z]\+");
	var P = {};

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
		console.log("router: got command: " + cmd );
		console.log("router: got params: " + pars );

		if( typeof pars === 'undefined' ) {
			for( var iterator in params ) {
				if( envelop.exec(iterator) !== null ) {
					temp = idx.exec(iterator);
					if( temp !== null ) {
						i = cutter.exec(temp[0]);
						if( i !== null && i.length > 0){
							ii = i[0];
							P[ii]=params[iterator];
						}
					}
				}
			}
			pars = JSON.stringify(P);
		}
		/* jQuery AJAX convinience method has a weird custom to reformat
		 * the quesry sent to server. The JSON notation is reworked for 
		 * object access strategy:
		 *
		 * Example:
		 * 	cmd=c&data={"a":"1":"b":"nop"} ~ cmd=c&data[a]=0&data[b]=nop
		 *
		 * This code is a poor man example to reparse the URL ...
		 */
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
