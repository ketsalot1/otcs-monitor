var server = require("./service");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var mongoHandlers = require("./mongoHandlers");

var handle = {};
handle['search'] = requestHandlers.search;
handle['send'] = requestHandlers.send;
handle['describe'] = requestHandlers.describe;
handle['save'] = requestHandlers.save;
handle['unlink'] = requestHandlers.unlink;
handle['queryDB'] = requestHandlers.queryDB;
handle['patches'] = requestHandlers.listPatches;
handle['projects'] = requestHandlers.listProjects;
handle['link'] = requestHandlers.linkPatch;
handle['create_patch'] = requestHandlers.newPatch;
handle['update_patch'] = requestHandlers.updatePatch;
handle['update_project'] = requestHandlers.updateProject;
handle['create_project'] = requestHandlers.createProject;
handle['insert_case'] = requestHandlers.insertCase;
handle['insert_case_full'] = requestHandlers.insertCaseFull;
handle['archive_case'] = requestHandlers.archiveCase;
handle['archive_patch'] = requestHandlers.archivePatch;
handle['set_case_status'] = requestHandlers.updateCaseStatus;
handle['jira'] = requestHandlers.updateCaseJira;
handle['get_all_cases'] = requestHandlers.getAllCases;
handle['get_overview'] = requestHandlers.itsmOverview;
handle['favorites'] = requestHandlers.favorites;
/* Assign service routines to keyword in the 
 * parameters in the incoming query. Assuming
 * the quesry contain parameter 'search', the 
 * search handler is used to service the call.
 * Similar pattern is true for 'send' parameter
 */

handle['mdb_test'] = mongoHandlers.testMDB;
handle['mdb_select'] = mongoHandlers.selectMDB;
handle['mdb_cursor'] = mongoHandlers.cursorMDB;
handle['mdb_insert_mail'] = mongoHandlers.insertMailMDB;
handle['mdb_remove_mail'] = mongoHandlers.removeMailMDB;
handle['mdb_retrieve_emails'] = mongoHandlers.retrieveEmailsFromMDB;
handle['mdb_retrieve_email_count'] = mongoHandlers.retrieveEmailCountFromMDB

server.service( router.route, handle );