var server = require("./service");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle['search'] = requestHandlers.search;
handle['send'] = requestHandlers.send;
handle['save'] = requestHandlers.save;
/* Assign service routines to keyword in the 
 * parameters in the incoming query. Assuming
 * the quesry contain parameter 'search', the 
 * search handler is used to service the call.
 * Similar pattern is true for 'send' parameter
 */

server.service( router.route, handle );
