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
		"Ext.data.proxy.JsonP"
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
					userButton,
					linkButton,
					editButton
		  		]
        };

		  var detailPanel = {
			   id: 'detailPanel',
			 	xtype: 'nestedlist',
				title: 'OTCS Case',
				displayField: 'description',
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
					itemtap: function(nestedList, list, index, element, post) {
									var lm = {};
									console.log('nestedList.itemtap event');
//                  			this.getDetailCard().setHtml(post.get('description') + '<br/><div class="list-item-underlined">&nbsp;<br/></div>' + post.get('status') + '<br/><div class="list-item-underlined">&nbsp;</div><br/>' + post.get('details'));

									opentext.data.activeCase = { 'case': post.get('case'), 'id': post.get('id') }; 

									lm.back = 0;
									if( post.get('patches') != null ) {
										if( post.get('jira') != null ) {
                  					this.getDetailCard().setHtml("<div style=\"font-size: 1.1em;font-weight: bold;\">Case: " + post.get('case') + '</div>Status: ' + post.get('status') + '<br/>' + post.get('patches') + '<br/>Jira:[<a href="http://jira.opentext.com/browse/' + post.get('jira') + '">' + post.get('jira')  + ']</a><br/><br/><div style=\"font-size: 0.8em;\">' + post.get('details') + '</div>');
										} else {
                  					this.getDetailCard().setHtml("<div style=\"font-size: 1.1em; font-weight: bold;\">Case: " + post.get('case') + '</div>Status: ' + post.get('status') + '<br/>' + post.get('patches') + '<br/>Jira:[none]<br/><br/><div style=\"font-size: 0.8em;\">' + post.get('details') + '</div>');
										}
										lm.ctrls = 1;
									} else {
                  				this.getDetailCard().setHtml("<div style=\"font-size: 1.1em; font-weight: bold;\">Schedule: " + post.get('case') + '</div>Status: ' + post.get('status') + '<br/><br/><div style=\"font-size: 0.8em;\">' + post.get('details') + '</div>');
										lm.ctrls = 0;
									}
									this.getParent().setUIfromMask( lm );

									var settings = Ext.getStore("settings");
									var cnt = Ext.getStore('count');

									var rec = settings.getAt(0);
									var data = rec.get('settingsContainer');
									var hostName = data[0];

									cnt.getProxy().setUrl( hostName + '?cmd=mdb_retrieve_email_count&data={"caseNo": "' + post.get('case') + '"}' );
									console.log('Request >' + cnt.getProxy().getUrl() + '<' );
									cnt.load( function( record, operation, success ) {
										Ext.Array.forEach(Ext.ComponentQuery.query('button'), function (button) {
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
					},
					back: function() {
									var lm = {};
									console.log('nestedList.back event');
//   								this.callParent(arguments);

									lm.back = 1;
									lm.ctrls = 0;
									this.getParent().setUIfromMask( lm );
					}
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
			lm.back = 1;
			lm.ctrls = 0;
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
		if( typeof opentext.data.activeCase == 'object' ) { 
			this.fireEvent("detailSetFavoritesCommand", opentext.data.activeCase);
		} else {
			console.error("No case selected");
		}
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
			}
			if (button.getId() === 'itsmdetail_user') {
				console.log( 'itsmdetail_user found!' );
				setUIControlfromMask( button, mask.ctrls );
			}
			if (button.getId() === 'itsmdetail_archive') {
				console.log( 'itsmdetail_archive found!' );
				setUIControlfromMask( button, mask.ctrls );
			}
			if (button.getId() === 'itsmdetail_fav') {
				console.log( 'itsmdetail_fav found!' );
				setUIControlfromMask( button, mask.ctrls );
				button.setBadgeText("");
			}
		});
	},
});