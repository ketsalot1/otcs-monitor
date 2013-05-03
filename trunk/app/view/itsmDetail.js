Ext.define("itsm.view.itsmDetail", {
	extend: "Ext.NestedList",
//	extend: "Ext.dataview.NestedList",
//	extend: "Ext.Container",
//	extend: "Ext.tab.Panel",
/* The nestedlist can only be displayed with corrrect view type.
 * Ext.tab.Panle or Ext.dataview.NetsedList. Other view types does not 
 * show the content but does not report asny problem either. It might
 * be rather annoying trap.
 */

	requires: [
//		"Ext.dataview.NestedList",
		"Ext.TitleBar",
		"Ext.data.proxy.JsonP",
		"Ext.ActionSheet",
		"itsm.view.setCheckpointForm"
	],

 	alias: "widget.itsmdetail",
	xtype: "itsmdetail",

	config:{
		id: 'itsmDetail',
		fullscreen: true,
		scrollable:'vertical',
		title: 'OTCS Monitor',
		ui: 'round',
		listeners: {
			painted: function() {
				console.log("itsmDetail.paint!");
			},
			// this is a custom even hadler inside a view. It can be used 
			// to propagate the internal events to the main controller.
			customEvent: function( data ) {
				console.log( "Custom event handler" );
				this.fireEvent( 'setCheckpointCaseCommand', opentext.data.activeCase );
			}
		}
	},

    initialize: function () { // <<<

        this.callParent(arguments);

        var backButton = {
            xtype: "button",
            ui: "back",
            text: "Home",
				id: "itsmdetail_back",
				listeners: {
					tap: { fn: this.onDetailBack, scope: this }
				}
        };

        var editButton = {
            xtype: "button",
            ui: "action",
            iconCls: "doc_compose1",
            iconMask: true,
				hidden: true,
				id: "itsmdetail_edit",
				listeners: {
					tap: { fn: this.onDetailEdit, scope: this }
				}
        };

        var linkButton = {
            xtype: "button",
            ui: "action",
            iconCls: "link2",
            iconMask: true,
				hidden: true,
				id: "itsmdetail_link",
				listeners: {
					tap: { fn: this.onDetailLink, scope: this }
				}
        };

        var userButton = {
            xtype: "button",
            ui: "action",
            iconCls: "user_add",
            iconMask: true,
				hidden: true,
				id: "itsmdetail_user",
				listeners: {
					tap: { fn: this.onDetailProject, scope: this }
				}
        };
		   
        var reworkButton = {
            xtype: "button",
            ui: "action",
            iconCls: "action",
            iconMask: true,
				hidden: true,
				id: "itsmdetail_rework",
				listeners: {
					tap: { fn: this.onDetailRework, scope: this }
				}
        };

        var archiveButton = {
            xtype: "button",
            ui: "action",
            iconCls: "trash2",
            iconMask: true,
				hidden: true,
				id: "itsmdetail_archive",
				listeners: {
					tap: { fn: this.onDetailArchive, scope: this }
				}
        };

			var favoritesButton = { 
            xtype: "button",
            ui: "action",
            iconCls: "favorites",
            iconMask: true,
				badgeText: "",
				hidden: true,
				id: "itsmdetail_fav",
				listeners: {
					tap: { fn: this.onDetailFavorites, scope: this }
				}
        };

			var showEmailsButton = { 
            xtype: "button",
            ui: "action",
            iconCls: "mail",
            iconMask: true,
				badgeText: "",
				hidden: true,
				id: "itsmdetail_mails",
				listeners: {
					tap: { fn: this.onDetailShowEmails, scope: this }
				}
        };

        var bottomToolbar = {
            xtype: "toolbar",
            docked: "bottom",
//            title: "OTCS Monitor",
            items: [
					backButton,
					{ xtype: 'spacer' },
					showEmailsButton,
					favoritesButton,
					archiveButton,
					reworkButton,
					linkButton,
					editButton
		  		]
        };

		  var detailPanel = {
			   id: 'detailPanel',
			 	xtype: 'nestedlist',
				title: 'OTCS Case',
				useTitleAsBackText: false,
				backText: 'Overview',
//				displayField: 'description',
//				data: { 'case': '111111', 'description': '--empty--' }, 
//				tpl: '<div>{case} - {description}</div>',
				store: Ext.getStore('desktopITSM'),
				/* <<<
				store: {
					type: 'tree',

					fields: ['case', 'description', 'status', 'details', {
						name: 'leaf',
						defaultValue: true
					}],

					root: {
						leaf: false
					},

					proxy: {
						type: 'jsonp',
						url: 'http://localhost:18080/jsfks/sencha?data01=hello&data02=wole',
						callbackKey: 'processSupportData',
						reader: {
							type: 'json',
							rootProperty: 'support_data.feed.entries'
						}
					}
				},
				*/

					/* Originally lined declaration of the object was the 
					 * only working model. After some time - by chnaging the
					 * container for view itself the external store start 
					 * working as well. MVC pattern was tough in this case :-(
					 */
				// >>>
				detailCard: {
					xtype: 'panel',
					scrollable: true,
					styleHtmlContent: true
				},

				listeners: {
					itemtap: { fn: this.onItemTap, scope: this },
								/* <<<
					itemtap: function(nestedList, list, index, element, post) {
						var lm = {};
						console.log('nestedList.itemtap event');
				
						opentext.data.activeCase = { 'case': post.get('case'), 'id': post.get('id') }; 
				
						lm.back = 0;
						// patches entries has the detail card only.
						if( post.get('patches') != null ) {
							if( post.get('jira') != null ) {
				          this.getDetailCard().setHtml("<div style=\"font-size: 1.1em;font-weight: bold;\">Case: " + post.get('case') + '</div>Status: ' + post.get('status') + '<br/>' + post.get('patches') + '<br/>Jira:[<a href="http://jira.opentext.com/browse/' + post.get('jira') + '">' + post.get('jira')  + ']</a><br/><br/><div style=\"font-size: 0.8em;\">' + post.get('details') + '</div>');
							} else {
				          this.getDetailCard().setHtml("<div style=\"font-size: 1.1em;font-weight: bold;\">Case: " + post.get('case') + '</div>Status: ' + post.get('status') + '<br/>' + post.get('patches') + '<br/>Jira:[none]<br/><br/><div style=\"font-size: 0.8em;\">' + post.get('details') + '</div>');
							}
							lm.ctrls = 1;
				
							var settings = Ext.getStore("settings");
							var cnt = Ext.getStore('count');
				
							var rec = settings.getAt(0);
							var data = rec.get('settingsContainer');
							var hostName = data[0];
				
							cnt.getProxy().setUrl( hostName + '?cmd=mdb_retrieve_email_count&data={"caseNo": "' + post.get('case') + '"}' );
							console.log('Request >' + cnt.getProxy().getUrl() + '<' );
							cnt.load( function( record, operation, success ) {
								Ext.Array.forEach(Ext.ComponentQuery.query('button'), function (button) {
									// slopy, not sure if the Button gets the saem ID again and again ...
									if( button.getId() === 'ext-button-7' )
										button.setText("OTCS Case");
									if (button.getId() === 'itsmdetail_mails') {
										console.log( 'E-Mail Details button found' );
										if( success == true ) {
											button.setBadgeText(Ext.getStore('count').getAt(0).get('count'));
										} else {
											button.setBadgeText("n/a");
										}
									}
								});
							});
						} else {
				        this.getDetailCard().setHtml("<div style=\"font-size: 1.1em; font-weight: bold;\">Schedule: " + post.get('case') + '</div>Status: ' + post.get('status') + '<br/><br/><div style=\"font-size: 0.8em;\">' + post.get('details') + '</div>');
							lm.ctrls = 0;
						}
						this.getParent().setUIfromMask( lm );
				
						if( this.getTitle() && (this.getTitle().length > 0)) {
							console.log("nestedList.itemtap event: curretn list has title:" + this.getTitle() );
						} else {
							console.log("nestedList.itemtap event: current list has no title. Set to 'Activity'");
							this.setTitle("Activity");
						}
					},
 >>> */
					back: { fn: this.onBack, scope: this }
/* <<<
					back: function() {
									var lm = {};
									console.log('nestedList.back event');
//   								this.callParent(arguments);

									lm.back = 1;
									lm.ctrls = 0;
									this.getParent().setUIfromMask( lm );
					}
>>> */
				},

				getItemTextTpl: function(node) {
					return '<table><tr><td><img src="{icon}" width="29px" height="29px"></td><td>&nbsp;&nbsp;</td><td><span style="font-weight: normal; font-size: 0.90em;">{description}</span></td></tr></table>';
				}
		  };

        this.add([
				detailPanel,
            bottomToolbar
//            { xtype: "fieldset",
//                items: [noteTitleEditor, noteNarrativeEditor]
//            }
        ]);

		  this.getToolbar().hide();
		  this.getBackButton().addListener( 'tap', this.onBackButtonTap );
		  console.log( this.getBackButton().getText() );

    }, // >>>

/* <<<
    onAboutTap: function () {
        console.log("view.NoteEditor.AboutButton");
        this.fireEvent("showAboutBox", this);
    },

	 onNoteSave: function() {
        console.log("view.NoteEditor.NoteSave");
        this.fireEvent("saveNoteCommand", this);
	 },

	onNoteDelete: function() {
		console.log("view.NoteEditor.NoteDelete");
		Ext.Msg.confirm( "Delete", "Delete selected note?", function(button) {
			if( button == "yes" ) {
				this.fireEvent('deleteNoteCommand', this);
			}
		}, this );
	},

	deleteNote: function(button) {
		if( button == "yes" ) {
			this.fireEvent('deleteNoteCommand', this);
		}
	},
>>> */

	onBack: function(nestedList) {
		var lm = {};
		console.log('nestedList.back event');
//   	this.callParent(arguments);

		lm.back = 1;
		lm.ctrls = 0;
		nestedList.getParent().setUIfromMask( lm );
	},

	onItemTap: function(nestedList, list, index, element, post) {
		var lm = {};
		console.log('nestedList.itemtap event');

		opentext.data.activeCase = { 'case': post.get('case'), 'id': post.get('id'), 'rework':post.get('rework') }; 

		lm.back = 0;
		// patches entries has the detail card only.
		if( post.get('patches') != null ) {
			if( post.get('jira') != null ) {
          nestedList.getDetailCard().setHtml( " \
					 <div class=\"custom-header\"> \
					 <h3 class=\"custom-header-overlap\">Details</h3></div> \
					<div class=\"custom-details-table\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name\">Subject:</div> \
							<div class=\"custom-details-cell-value\">" + post.get('description') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table right\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name left\">Status:</div> \
							<div class=\"custom-details-cell-value left\">" + post.get('status') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name\">Case:</div> \
							<div class=\"custom-details-cell-value\">" + post.get('case') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table right\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name left\">Jira:</div> \
							<div class=\"custom-details-cell-value left\">[<a href=\"https://jira.opentext.com/browse/" + post.get('jira') + "\">" + post.get('jira') + "</a>]</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name\">Project:</div> \
							<div class=\"custom-details-cell-value\">" + post.get('project') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table right\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name left\">Update on:</div> \
							<div class=\"custom-details-cell-value left\">" + post.get('checkpoint') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name\">Checkpoint:</div> \
							<div class=\"custom-details-cell-value\">" + post.get('checkpoint') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table right\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name left\">Reworking:</div> \
							<div class=\"custom-details-cell-value left\">" + post.get('rework') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name\">Created:</div> \
							<div class=\"custom-details-cell-value\">" + post.get('start') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table collspan\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name\">Patches:</div> \
							<div class=\"custom-details-cell-value\">" + post.get('patches') + "</div> \
						</div> \
					</div> \
					 <div class=\"collspan\">&nbsp;</div> \
					 <div class=\"custom-header collspan\"> \
					 <h3 class=\"custom-header-overlap\">Synopsis</h3></div> \
					<div style=\"font-size: 0.9em;padding-left:8px; clear: both\">" + post.get('synopsis') + "</div> \
					 <div class=\"collspan\">&nbsp;</div> \
					 <div class=\"custom-header collspan\"> \
					 <h3 class=\"custom-header-overlap\">Chronicle</h3></div> \
					<div style=\"font-size: 0.8em;padding-left:8px; clear: both\">" + post.get('details') + "</div>");

			} else {

          nestedList.getDetailCard().setHtml(" \
					 <div class=\"custom-header\"> \
					 <h3 class=\"custom-header-overlap\">Details</h3></div> \
					<div class=\"custom-details-table\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name\">Subject:</div> \
							<div class=\"custom-details-cell-value\">" + post.get('description') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table right\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name left\">Status:</div> \
							<div class=\"custom-details-cell-value left\">" + post.get('status') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name\">Case:</div> \
							<div class=\"custom-details-cell-value\">" + post.get('case') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table right\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name left\">Jira:</div> \
							<div class=\"custom-details-cell-value left\">[not set yet]</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name\">Project:</div> \
							<div class=\"custom-details-cell-value\">" + post.get('project') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table right\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name left\">Update on:</div> \
							<div class=\"custom-details-cell-value left\">" + post.get('checkpoint') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name\">Checkpoint:</div> \
							<div class=\"custom-details-cell-value\">" + post.get('checkpoint') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table right\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name left\">Reworking:</div> \
							<div class=\"custom-details-cell-value left\">" + post.get('rework') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name\">Created:</div> \
							<div class=\"custom-details-cell-value\">" + post.get('start') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table collspan\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name\">Patches:</div> \
							<div class=\"custom-details-cell-value\">" + post.get('patches') + "</div> \
						</div> \
					</div> \
					 <div class=\"collspan\">&nbsp;</div> \
					 <div class=\"custom-header collspan\"> \
					 <h3 class=\"custom-header-overlap\">Synopsis</h3></div> \
					<div style=\"font-size: 0.9em;padding-left:8px; clear: both\">" + post.get('synopsis') + "</div> \
					 <div class=\"collspan\">&nbsp;</div> \
					 <div class=\"custom-header collspan\"> \
					 <h3 class=\"custom-header-overlap\">Chronicle</h3></div> \
					<div style=\"font-size: 0.8em;padding-left:8px; clear: both\">" + post.get('details') + "</div>");
			}
			lm.ctrls = 1;

			var settings = Ext.getStore("settings");
			var cnt = Ext.getStore('count');

			var rec = settings.getAt(0);
			var data = rec.get('settingsContainer');
			var hostName = data[0];

			cnt.getProxy().setUrl( hostName + '?cmd=mdb_retrieve_email_count&data={"caseNo": "' + post.get('case') + '"}' );
			console.log('Request >' + cnt.getProxy().getUrl() + '<' );
			cnt.load( function( record, operation, success ) {
				Ext.Array.forEach(Ext.ComponentQuery.query('button'), function (button) {
					// slopy, not sure if the Button gets the saem ID again and again ...
					if( button.getId() === 'ext-button-7' )
						button.setText("OTCS Case");
					if (button.getId() === 'itsmdetail_mails') {
						console.log( 'E-Mail Details button found' );
						if( success == true ) {
							button.setBadgeText(Ext.getStore('count').getAt(0).get('count'));
						} else {
							button.setBadgeText("n/a");
						}
					}
				});
			});
		} else {
//        nestedList.getDetailCard().setHtml("<div style=\"font-size: 1.1em; font-weight: bold;\">Schedule: " + post.get('case') + '</div>Status: ' + post.get('status') + '<br/><br/><div style=\"font-size: 0.8em;\">' + post.get('details') + '</div>');
        nestedList.getDetailCard().setHtml(" \
					 <div class=\"custom-header\"> \
					 <h3 class=\"custom-header-overlap\">Details</h3></div> \
					<div class=\"custom-details-table\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name\"> Patch:</div> \
							<div class=\"custom-details-cell-value\">" + post.get('description') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table right\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name left\">Status:</div> \
							<div class=\"custom-details-cell-value left\">" + post.get('status') + "</div> \
						</div> \
					</div> \
					<div class=\"custom-details-table\"> \
						<div class=\"custom-details-row\"> \
							<div class=\"custom-details-cell-name\">Schedule:</div> \
							<div class=\"custom-details-cell-value\">" + post.get('case') + "</div> \
						</div> \
					</div> \
					 <div class=\"collspan\">&nbsp;</div> \
					 <div class=\"custom-header collspan\"> \
					 <h3 class=\"custom-header-overlap\">Fixed isues</h3></div> \
					<div style=\"font-size: 0.8em;padding-left:8px; clear: both\">" + post.get('details') + "</div>");

			lm.ctrls = 0;
		}

		nestedList.getParent().setUIfromMask( lm );

		if( nestedList.getTitle() && (nestedList.getTitle().length > 0)) {
			console.log("nestedList.itemtap event: current list has title:" + nestedList.getTitle() );
			nestedList.setTitle("Rework");
		} else {
			console.log("nestedList.itemtap event: current list has no title. Set to 'Activity'");
			nestedList.setTitle("Activity");
		}
	},

	onDetailBack: function() {
		var lm = {};
		console.log("view.itsmDetail.Back");
		lm.back = 1;
		lm.ctrls = 0;
		this.setUIfromMask( lm );
		this.fireEvent("detailBackCommand", this);
	},

	onDetailEdit: function() {
		var lm = {};
		console.log("view.itsmDetail.Edit");
		if( typeof opentext.data.activeCase == 'object' ) { 
			this.fireEvent("detailEditCommand", opentext.data.activeCase);
		} else {
			console.error("No case selected");
		}
	},

	onDetailShowEmails: function() {
		var lm = {};
		console.log("view.itsmDetail.showEmails");
		if( typeof opentext.data.activeCase == 'object' ) { 
			lm.back = 0;
			lm.ctrls = 1;
			this.setUIfromMask( lm );
			this.fireEvent("detailShowEmailsCommand", opentext.data.activeCase);
		} else {
			console.error("No case selected");
		}
	},

	onDetailLink: function() {
		var lm = {};
		console.log("view.itsmDetail.Link");
		if( typeof opentext.data.activeCase == 'object' ) { 
			this.fireEvent("detailLinkPatchCommand", opentext.data.activeCase);
		} else {
			console.error("No case selected");
		}
	},

	onDetailRework: function() {
		var lm = {};
		console.log("view.itsmDetail.followRework");

		if( !this.rework ) {
			var reworkSheet = Ext.create('Ext.ActionSheet', {
	 			alias: "widget.reworkactionpanel",
				xtype: "reworkactionpanel",
	    		items: [
	        		{
	            	text: 'show cross-referred rework',
						scope: this,
						handler: function() {
							this.rework.hide();
							if( typeof opentext.data.activeCase == 'object' && typeof opentext.data.activeCase.rework == 'number' ) { 
								lm.back = 1;
								lm.ctrls = 0;
								this.setUIfromMask( lm );
								lm.caseNo = opentext.data.activeCase.rework;
								lm.searchAll = 1;
								lm.searchAsText = 0;
								var nl = Ext.getCmp('detailPanel');
								nl.traverse = true;
								// Nasty way to get back to root node in the nested list
								nl.onBackTap();
								nl.onBackTap();
								nl.onBackTap();
								nl.onBackTap();
								nl.onBackTap();
								this.fireEvent('searchCaseCommand', lm );
							} else {
								console.error("No rework to follow for selected case or no case selected");
								Ext.Msg.alert("No rework to follow");
							}
						}
	        		},
					{
						text: 'remove checkpoint date',
						scope: this,
						handler: function() {
							this.rework.hide();	
							if( typeof opentext.data.activeCase == 'object' ) { 
								lm.back = 0;
								lm.ctrls = 1;
								this.setUIfromMask( lm );
								this.fireEvent('resetCheckpointCaseCommand', opentext.data.activeCase );
							} else {
								console.error("Checkpoint cannot be removed for selected case or no case selected");
								Ext.Msg.alert("Error removing checkpoint");
							}
						}
					},
					{
						text: 'set checkpoint date',
						scope: this,
						handler: function() {
							this.rework.hide();	
							if( typeof opentext.data.activeCase == 'object' ) { 
								lm.back = 0;
								lm.ctrls = 1;
								this.setUIfromMask( lm );

								if( !this.checkpoint ) {
									var checkpointSheet = Ext.create('Ext.Panel', {
	 									alias: "widget.checkpointactionpanel",
										xtype: "checkpointactionpanel",
										scope: this,
										modal: true,
										hideOnMaskTap: false,
										showAnimation: {
											type: 'popIn',
											duration: 250,
											easing: 'ease-out'
										},
										hideAnimation: {
											type: 'popOut',
											duration: 250,
											easing: 'ease-out'
										},
										centered: true,
										width: Ext.os.deviceType == 'Phone' ? 260 : 400,
										height: Ext.os.deviceType == 'Phone' ? 230 : 230,
	    								items: [
											{
												xtype: 'toolbar',
												title: 'Checkpoint Date',
												docking: 'top',
												scope: this,
												items: [
													{
														xtype: "button",
														ui: "back",
														text: "Back",
														scope: this,
														listeners: {
														//	tap: { fn: this.onCheckpointBackButtonTap, scope: this }
															tap: function() {
																console.log("onCheckpointBackButtonTap handler called");
																this.getParent().getParent().hide();
															}

														}
													},
													{
														xtype: 'spacer'
													},
													{
														xtype: "button",
														ui: "action",
														text: "Save",
														scope: this,
														listeners: {
															// element: 'element', // this one does not work. It only duplicates the count of calls to handler,
															tap: function() {
																console.log("onCheckpointSaveButtonTap handler called");
																// Thogh this Panel view is constructed as an model dialog inside the main view 
																// as an internal element, it cannot use the path traversal (getParent()) to get
																// reference to the main view. Uses the global function to look up the main view
																// and use it as an owner for trigerring an event. Such an even is than visible
																// in the global controller.
																var dt = Ext.getCmp('itsmDetail');
																dt.fireEvent( 'setCheckpointCaseCommand', opentext.data.activeCase );

																// Using propagation through an internal even handler,
																// dt.fireEvent( 'customEvent', opentext.data.activeCase );
																
																// Using function call on the view level. The view function can than
																// call the event registered with the main controller.
																// dt.onCheckpointSaveButton( opentext.data.activeCase );
															
																this.getParent().getParent().hide();
															}
														}
													}
												]
											},
											{
												xtype: 'setcheckpointform'
											}
										]
									});
									this.checkpoint = Ext.Viewport.add(checkpointSheet);
								}	
								this.checkpoint.show();
							}
						}
					}
	    		]
			});

			this.rework = Ext.Viewport.add(reworkSheet);
		}	
		this.rework.show();
	},

	onDetailProject: function() {
		var lm = {};
		console.log("view.itsmDetail.setProject");
		if( typeof opentext.data.activeCase == 'object' ) { 
			this.fireEvent("detailLinkProjectCommand", opentext.data.activeCase);
		} else {
			console.error("No case selected");
		}
	},

	onDetailArchive: function() {
		var lm = {};
		console.log("view.itsmDetail.setArchived");

		function onReply(btn) {
			if( btn == "yes" ) {
				this.fireEvent("detailSetArchivedCommand", opentext.data.activeCase);
			} else {
				console.log("view.itsmDetail.setArchived - update canceled");
			}
		}

		if( typeof opentext.data.activeCase == 'object' ) { 
			Ext.Msg.confirm("Confirmation", "Archive the case?", onReply, this );
		} else {
			console.error("No case selected");
		}
	},

	onDetailFavorites: function() {
		console.log("view.itsmDetail.setFavorites");

		if( !this.actions ) {
			var actionSheet = Ext.create('Ext.ActionSheet', {
	 			alias: "widget.detailactionpanel",
				xtype: "detailactionpanel",
	    		items: [
	        		{
	            	text: 'Set/Clear Favorites',
						scope: this,
						handler: function() {
							this.actions.hide();
							if( typeof opentext.data.activeCase == 'object' ) { 
								this.fireEvent("detailSetFavoritesCommand", opentext.data.activeCase);
							} else {
								console.error("No case selected");
							}
						}
	        		},
	        		{
	            	text: 'Set/Clear Hotfix',
						scope: this,
						handler: function() {
							this.actions.hide();
							if( typeof opentext.data.activeCase == 'object' ) { 
								this.fireEvent("detailSetHotfixCommand", opentext.data.activeCase);
							} else {
								console.error("No case selected");
							}
						}
	        		}
	    		]
			});

			this.actions = Ext.Viewport.add(actionSheet);
		}	
		this.actions.show();
	},

	setUIfromMask: function( mask ) {
		Ext.Array.forEach(Ext.ComponentQuery.query('button'), function (button) {
				// if the button is the change iconCls button, continue
			function setUIControlfromMask( ctrl, mask ) {
				if( mask === 1 )
					ctrl.show();
				else
					ctrl.hide();
			}

			if (button.getId() === 'itsmdetail_back') {
				console.log( 'itsmdetail_back found!' );
				setUIControlfromMask( button, mask.back );
			}
			if (button.getId() === 'itsmdetail_mails') {
				console.log( 'itsmdetail_back found!' );
				setUIControlfromMask( button, mask.ctrls );
			}
			if (button.getId() === 'itsmdetail_edit') {
				console.log( 'itsmdetail_edit found!' );
				setUIControlfromMask( button, mask.ctrls );
			}
			if (button.getId() === 'itsmdetail_link') {
				console.log( 'itsmdetail_link found!' );
				setUIControlfromMask( button, mask.ctrls );
				button.setBadgeText("");
			}
			if (button.getId() === 'itsmdetail_user') {
				console.log( 'itsmdetail_user found!' );
				setUIControlfromMask( button, mask.ctrls );
			}
			if (button.getId() === 'itsmdetail_archive') {
				console.log( 'itsmdetail_archive found!' );
				setUIControlfromMask( button, mask.ctrls );
			}
			if (button.getId() === 'itsmdetail_rework') {
				console.log( 'itsmdetail_rework found!' );
				setUIControlfromMask( button, mask.ctrls );
			}
			if (button.getId() === 'itsmdetail_fav') {
				console.log( 'itsmdetail_fav found!' );
				setUIControlfromMask( button, mask.ctrls );
				button.setBadgeText("");
			}
		});
	},

	onCheckpointSaveButton: function( data ) {
		this.fireEvent('setCheckpointCaseCommand', data );
	}

});
