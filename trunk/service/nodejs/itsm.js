var server = require("./service");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle['search'] = requestHandlers.search;
handle['send'] = requestHandlers.send;
handle['describe'] = requestHandlers.describe;
handle['save'] = requestHandlers.save;
handle['unlink'] = requestHandlers.unlink;
handle['queryDB'] = requestHandlers.queryDB;
handle['patches'] = requestHandlers.listPatches;
handle['link'] = requestHandlers.linkPatch;
handle['create_patch'] = requestHandlers.newPatch;
handle['update_patch'] = requestHandlers.updatePatch;
/* Assign service routines to keyword in the 
 * parameters in the incoming query. Assuming
 * the quesry contain parameter 'search', the 
 * search handler is used to service the call.
 * Similar pattern is true for 'send' parameter
 */

server.service( router.route, handle );
