var fs = require('fs');

// PERFORMANCE TESTS
function getPage( callback, dataName, res ) {
// <<<
	var dataFile = '';
	var pages = [];
	try {
		dataObj=JSON.parse(dataName);
		dataFile = dataObj.dataName;
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
				res.write(JSON.stringify(pages));
				res.end();
			}
			catch(e) {
//				logger.error(e.name);
				res.writeHead(404);
				res.end(e.name + ': ' + e.message);
			}
	});
} // >>>

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
} // >>>

// Kerry's version of the funciton
function getPages_K( callback, dataName, res ) { 
// <<<
	var dataFile = '/tmp/';
	var R = {};
	R.GetPagesResult = {};
	R.GetPagesResult.cssFile = {};
	R.GetPagesResult.cssFile.content = '.dummy_style { dummy_paramter: "dummy_value"}';
	R.GetPagesResult.cssFile.timeStamp = "";
	R.GetPagesResult.frstPgNum = 1;
	R.GetPagesResult.lastPgNum = 5;
	R.GetPagesResult.pages = [];
	R.GetPagesResult.totalPages = 20;

	try {
		dataObj=JSON.parse(dataName);
		dataFile += dataObj.dataName;
		dataFile = '/home/martinme/www/spicer/content/p1.html';
	}
	catch(e) {
//		logger.warn("getPages: parsing of arguments failed, sending back complete descriptor");
		dataFile = '/tmp/stripped0.html';
		dataFile = '/home/martinme/www/spicer/content/p1.html';
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
				R.GetPagesResult.pages[0] = {};
				R.GetPagesResult.pages[0].content = data;
				R.GetPagesResult.pages[0].pageNum = 1;
//				res.write('{"pages": { "page_0000": ');
//				res.write(JSON.stringify(data));
//				res.write('},"responseDetails":null,"responseStatus":200}');

				dataFile = '/tmp/stripped1.html';
				dataFile = '/home/martinme/www/spicer/content/p2.html';
				fs.readFile(dataFile, 'utf-8', function (error, data1) {
					// <<<
					try {
						if( error ) throw error.toString();
						R.GetPagesResult.pages[1] = {};
						R.GetPagesResult.pages[1].content = data1;
						R.GetPagesResult.pages[1].pageNum = 2;

						dataFile = '/tmp/stripped2.html';
						dataFile = '/home/martinme/www/spicer/content/p3.html';
						fs.readFile(dataFile, 'utf-8', function (error, data2) {
							// <<<
							try {
								if( error ) throw error.toString();
								R.GetPagesResult.pages[2] = {};
								R.GetPagesResult.pages[2].content = data2;
								R.GetPagesResult.pages[2].pageNum = 3;

								dataFile = '/tmp/stripped3.html';
								dataFile = '/home/martinme/www/spicer/content/p4.html';
								fs.readFile(dataFile, 'utf-8', function (error, data3) {
									// <<<
									try {
										if( error ) throw error.toString();
										R.GetPagesResult.pages[3] = {};
										R.GetPagesResult.pages[3].content = data3;
										R.GetPagesResult.pages[3].pageNum = 4;

										dataFile = '/tmp/stripped4.html';
										dataFile = '/home/martinme/www/spicer/content/p5.html';
										fs.readFile(dataFile, 'utf-8', function (error, data4) {
											// <<<
											try {
												if( error ) throw error.toString();
												R.GetPagesResult.pages[4] = {};
												R.GetPagesResult.pages[4].content = data4;
												R.GetPagesResult.pages[4].pageNum = 5;
												
												dataFile = '/tmp/stripped.css';
												dataFile = '/home/martinme/www/spicer/content/styles.css';
												fs.readFile(dataFile, 'utf-8', function (error, data_css) {
													// <<<
													try {
														if( error ) throw error.toString();
														R.GetPagesResult.cssFile.content = data_css;

														res.write(JSON.stringify(R));
														res.end();
													}
													catch(e) {
														res.writeHead(404);
														res.end(e.name + ': ' + e.message);
													}
												}); // >>>
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
	
} // >>>

exports.getPages_K=getPages_K;
exports.getPage=getPage;
exports.getPages=getPages;
