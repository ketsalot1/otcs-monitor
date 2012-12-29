 var log4js = require('log4js');
log4js.configure('log4js.configuration.json', {});


 var log4js = require('log4js'); 
//console log is loaded by default, so you won't normally need to do this
//log4js.loadAppender('console');
log4js.loadAppender('file');
//log4js.addAppender(log4js.appenders.console());
log4js.addAppender(log4js.appenders.file('logs/cheese.log'), 'cheese');

var logger = log4js.getLogger('cheese');
logger.setLevel('ERROR');

logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');


 var log4js = require('log4js');
log4js.configure({
        appenders: [
                { type: 'console' },
                { type: 'file', filename: 'logs/cheese.log', category: 'cheese' }
        ]
});


==========================

 // function to create employee
exports.add_employee = function(data, callback) {
 client.query("insert into employees (name, salary) values (?,?)", [data.name, data.salary], function(err, info) {
    // callback function returns last insert id
    callback(info.insertId);
    console.log('Employee '+data.name+' has salary '+data.salary);
  });
}
 
// function to get list of employees
exports.get_employees = function(callback) {
  client.query("select * from employees", function(err, results, fields) {
    // callback function returns employees array
    callback(results);
  });
}

===============================

for (var i = 0; i < recentBlogPostIds.length; i++) {
	pending++;
	asynchronousDB.getBlogPostById(blogPostId, function(err, post) {
		results.push(post);
 	  	pending--;
  		checkPending();
	});
}

function checkPending() {
	if (pending === 0) doCallback(results);
}
