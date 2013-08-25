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

// OBSOLETE
function getData( callback, pattern, res ) {
// <<<
	logger.trace('jQueryHandler.getData: >' + pattern + '<');
	var R = {};
	try {
		R.responseText="OK";
		R.responseCode=200;
		R.data={};
		R.data.counter=3;
		R.data.feed=[];
		R.data.feed[0]="Prvni text";
		R.data.feed[1]="Druhy text";
		R.data.feed[2]="Treti text";
	}
	catch(e) {
 		logger.error('jQueryHandlers.getData: Error: ' + e.name + " - " + e.message );
 		res.writeHead(404);
 		res.end(e.name + ': ' + e.message);
	}

	res.writeHead(200, {
 		'Content-Type': 'text/plain'
	});
	if( callback )
		res.end(callback + '(' + JSON.stringify(R) + ')');
	else
		res.end(JSON.stringify(R));
	logger.trace('jQueryHandlers.getData leave');
}
// >>>

exports.getData = getData;
