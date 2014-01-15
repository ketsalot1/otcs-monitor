var fs = require('fs');

// PERFORMANCE TESTS
function getPages( callback, dataName, res ) {
// <<<
	var dataFile = '/tmp/';
	var pages = [];
	try {
		dataObj=JSON.parse(dataName);
		dataFile += dataObj.dataName;
	}
	catch(e) {
//		logger.warn("getPages: parsing of arguments failed, sending back complete descriptor");
		dataFile = '/tmp/testik.html';
	}
//	logger.trace('requestHandler.getPages: requested file: ' + dataFile );
	fs.readFile(dataFile, 'utf-8', function (error, data) {
			res.writeHead(200, {
				'Content-Type': 'text/plain',
				'Access-Control-Allow-Headers': 'Origin, x-customheader, content-type',
				'Access-Control-Allow-Method': 'POST, GET',
				'Access-Control-Allow-Origin': 'http://localhost, http://ubumame1204.opentext.net',
				'Access-Control-Max-Age': '1728000'
			});
			try {
				if( error ) throw error.toString();
				pages[0] = {};
				pages[0].page = data;
//				res.write('{"pages": { "page_0000": ');
//				res.write(JSON.stringify(data));
//				res.write('},"responseDetails":null,"responseStatus":200}');

				dataFile = '/tmp/single1.html';
				fs.readFile(dataFile, 'utf-8', function (error, data1) {
					// <<<
					try {
						if( error ) throw error.toString();
						pages[1] = {};
						pages[1].page = data1;

						dataFile = '/tmp/single2.html';
						fs.readFile(dataFile, 'utf-8', function (error, data2) {
							// <<<
							try {
								if( error ) throw error.toString();
								pages[2] = {};
								pages[2].page = data2;

								dataFile = '/tmp/single3.html';
								fs.readFile(dataFile, 'utf-8', function (error, data3) {
									// <<<
									try {
										if( error ) throw error.toString();
										pages[3] = {};
										pages[3].page = data3;

										dataFile = '/tmp/single4.html';
										fs.readFile(dataFile, 'utf-8', function (error, data4) {
											// <<<
											try {
												if( error ) throw error.toString();
												pages[4] = {};
												pages[4].page = data4;
												
												res.write(JSON.stringify(pages));
												res.end();
											}
											catch(e) {
//												logger.error(e.name);
												res.writeHead(404);
												res.end(e.name + ': ' + e.message);
											}
										}); // >>>
									}
									catch(e) {
//										logger.error(e.name);
										res.writeHead(404);
										res.end(e.name + ': ' + e.message);
									}
								}); // >>>
							}
							catch(e) {
//								logger.error(e.name);
								res.writeHead(404);
								res.end(e.name + ': ' + e.message);
							}
						}); // >>>
					}
					catch(e) {
//						logger.error(e.name);
						res.writeHead(404);
						res.end(e.name + ': ' + e.message);
					}
				}); // >>>
			}
			catch(e) {
//				logger.error(e.name);
				res.writeHead(404);
				res.end(e.name + ': ' + e.message);
			}
	});
}

exports.getPages=getPages;
