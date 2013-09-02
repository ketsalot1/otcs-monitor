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
		R.responseStatus=200;
		R.support_data={};
		R.support_data.feed={};
		R.support_data.feed.entries=[];
		R.support_data.feed.entries[0]={"description":'0: OTCS Ticket 1669447 - WebViewer 10.2 patch -006 "PDFL Exception: 0x2001000e:Expected a dict object"'};
		R.support_data.feed.entries[1]={"description":'1: OTCS Ticket 1699223 - Java Viewer 9.7 and 10 - problem with chosing colour of annotations on Japanese OS'};
		R.support_data.feed.entries[2]={"description":'2: OTCS Ticket 1709907 - LLImaging module 10.3.0 causes Problems - URGENT'};
		R.support_data.feed.entries[3]={"description":'3: OTCS Ticket 1713885 - WebViewer 10.2 - printlist export as plain .txt result in incomplete output.'};
		R.support_data.feed.entries[4]={"description":'4: OTCS Ticket 1714608 - LLImaging Module 10.3 - Deichmann'};
		R.support_data.feed.entries[5]={"description":'5: OTCS Ticket 1717501 - SAP & WebViewer 10.2 patch -006 - solving Document Title problem caused ERROR messages'};
		R.support_data.feed.entries[6]={"description":'6: OTCS Ticket 1719136 - WebViewer 10.2 -006 .. sending .jpg format multi page files as mail attachments.'};
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
