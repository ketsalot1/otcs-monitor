var server = require("./service");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var mongoHandlers = require("./mongoHandlers");

var handle = {};
handle['search'] = requestHandlers.search;
handle['send'] = requestHandlers.send;
handle['describe'] = requestHandlers.describe;
handle['save'] = requestHandlers.save;
handle['update_case_info'] = requestHandlers.save; // convenience to 'save'
handle['update_case_info_ex'] = requestHandlers.saveEx;
handle['unlink'] = requestHandlers.unlink;
handle['queryDB'] = requestHandlers.queryDB;
handle['patches'] = requestHandlers.listPatches;
handle['projects'] = requestHandlers.listProjects;
handle['link'] = requestHandlers.linkPatch;
handle['insert_patch_link'] = requestHandlers.linkPatch;
handle['create_patch'] = requestHandlers.newPatch;
handle['update_patch'] = requestHandlers.updatePatch;
handle['update_project'] = requestHandlers.updateProject;
handle['insert_project_link'] = requestHandlers.updateProject; // convinience link 'update_project'
handle['create_project'] = requestHandlers.createProject;
handle['insert_case'] = requestHandlers.insertCase;
handle['insert_case_full'] = requestHandlers.insertCaseFull;
handle['archive_case'] = requestHandlers.archiveCase;
handle['archive_patch'] = requestHandlers.archivePatch;
handle['archive_patch_ex'] = requestHandlers.archivePatchEx;
handle['set_case_status'] = requestHandlers.updateCaseStatus;
handle['jira'] = requestHandlers.updateCaseJira;
handle['insert_jira_link'] = requestHandlers.updateCaseJira; // convinience methid for 'jira'
handle['get_all_cases'] = requestHandlers.getAllCases;  // dead code?
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

handle['get_feed'] = mongoHandlers.retrieveRecentEmailsFromMDB;

server.service( router.route, handle );
