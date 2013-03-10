Ext.define("itsm.view.emailView", {
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

 	alias: "widget.emailview",
	xtype: "emailview",

	config:{
		id: 'emailView',
		fullscreen: true,
		scrollable:'vertical',
		title: 'Inbox',
		ui: 'round',
		listeners: {
			painted: function() {
				console.log("emailView.paint event");
			}
		}
	},

    initialize: function () { // <<<

        this.callParent(arguments);

        var backButton = {
            xtype: "button",
            ui: "back",
            text: "Home",
				id: "emailview_back",
				listeners: {
					tap: { fn: this.onEmailViewBack, scope: this }
				}
        };

        var actionButton = {
            xtype: "button",
            ui: "action",
            iconCls: "action",
            iconMask: true,
				hidden: true,
				id: "emailview_action",
				listeners: {
					tap: { fn: this.onEmailViewAction, scope: this }
				}
        };

        var bottomToolbar = {
            xtype: "toolbar",
            docked: "bottom",
            items: [
					backButton,
					{ xtype: 'spacer' },
					actionButton
		  		]
        };

		  var emailPanel = {
			   id: 'emailPanel',
			 	xtype: 'nestedlist',
				title: 'E-Mail',

//				itemTpl: '{sentOn}{mailSender}',
//				displayField: 'mailSender',
				
//				data: { 'case': '111111', 'description': '--empty--' }, 
//				tpl: '<div>{case} - {description}</div>',
				store: Ext.getStore('email'),
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
									lm.back = 0;
									lm.ctrls = 1;
									console.log('nestedList.itemtap event');

									//	TODO - verify this. I don't think I need this ...
									opentext.data.activeMail = { 'caseNo': post.get('caseNo'), 'mailSender': post.get('mailSender'), 'mailSubject': post.get('mailSubject') }; 

                  			this.getDetailCard().setHtml(post.get('mailHTMLBody'));
									this.getParent().setUIfromMask( lm );
					},
					back: function() {
									var lm = {};
									console.log('nestedList.back event');
//   								this.callParent(arguments);

									lm.back = 1;
									lm.ctrls = 0;
									this.getParent().setUIfromMask( lm );
					}
				},

				/* This override does not seem to work as described in docu. 
				 * This work actually the way as described in 'itemTpl' for a List.
				 */
				getItemTextTpl: function(node) {
//					return node.getData().mailSender + " " + node.getData().sentOn;
					return '<table><tr><td><img src="{icon}" width="31px" height="31px"></td><td>&nbsp;&nbsp;</td><td><span style="font-weight: bold; font-size: 0.90em;">{mailSender}&nbsp;&nbsp;</span><span style="font-size: 0.70em;">({sentOn})<br/>{mailSubject}</span></td></tr></table>';
//					return '<div><table><tr><td><img src="{icon}" width="24px" height="24px"></td><td><p>&nbsp;&nbsp;</p></td><td><p class="list-item-title">{title}</p></td></tr></table></div>'

				}
		  };

        this.add([
				emailPanel,
            bottomToolbar
//            { xtype: "fieldset",
//                items: [noteTitleEditor, noteNarrativeEditor]
//            }
        ]);

		  this.getToolbar().hide();
		  this.getBackButton().addListener( 'tap', this.onBackButtonTap );


		  console.log( "emailView initialized: " + this.getBackButton().getText() );

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


>>> */

	onEmailViewBack: function() {
		var lm = {};
		console.log("view.emailView.back");
		if( typeof opentext.data.activeCase == 'object' ) { 
			lm.back = 1;
			lm.ctrls = 0;
			this.setUIfromMask( lm );
			this.fireEvent("emailViewBackCommand", opentext.data.activeCase);
		} else {
			console.error("No case selected");
		}
	},

	onEmailViewAction: function() {
		console.log("view.emailView.action");
		if( typeof opentext.data.activeMail == 'object' ) { 
//			this.fireEvent("detailSetFavoritesCommand", opentext.data.activeCase);


			if( !this.actions ) {
				var actionSheet = Ext.create('Ext.ActionSheet', {
	 				alias: "widget.emailactionpanel",
					xtype: "emailactionpanel",
	    			items: [
	        			{
	            		text: 'Delete message',
	            		ui  : 'decline',
							scope: this,
							handler: function() {
								Ext.Msg.alert("Sorry, not available");
								this.actions.hide();
							}
	        			},
	        			{
	            		text: 'Reply',
							scope: this,
							handler: function() {
								var d = 'mailto:' + opentext.data.activeMail.mailSender + '?cc=eng-ccc-projman@ixos.cz&subject=' + opentext.data.activeMail.mailSubject;
								if( d.length > 255 ) { 
									console.log( "Reply: mail command too long, cutting it");
									d = 'mailto:' + opentext.data.activeMail.mailSender + '?cc=eng-ccc-projman@ixos.cz&subject=' + opentext.data.activeMail.mailSubject.substring(0,96) + '...' ;
								}
								document.location.href = d;
								this.actions.hide();
							}
	        			},
	       			{
	            		text: 'Reply All',
							scope: this,
							handler: function() {
								var d = 'mailto:' + opentext.data.activeMail.mailSender + '?cc=eng-ccc-projman@ixos.cz&subject=' + opentext.data.activeMail.mailSubject;
								if( d.length > 255 ) { 
									console.log( "Reply All: mail command too long, cutting it");
									d = 'mailto:' + opentext.data.activeMail.mailSender + '?cc=eng-ccc-projman@ixos.cz&subject=' + opentext.data.activeMail.mailSubject.substring(0,96) + '...' ;
								}
								document.location.href = d;
								this.actions.hide();
							}
	        			},
	       			{
	            		text: 'Forward',
							scope: this,
							handler: function() {
								var d = 'mailto:address@nowhere.com?cc=eng-ccc-projman@ixos.cz&subject=' + opentext.data.activeMail.mailSubject;
								if( d.length > 255 ) { 
									console.log( "Forward: mail command too long, cutting it");
									d = 'mailto:address@nowhere.com?cc=eng-ccc-projman@ixos.cz&subject=' + opentext.data.activeMail.mailSubject.substring(0,96) + '...' ;
								}
								document.location.href = d;
								this.actions.hide();
							}
	        			}
	    			]
				});

				this.actions = Ext.Viewport.add(actionSheet);
			}	
			this.actions.show();


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

			if (button.getId() === 'emailview_back') {
				console.log( 'itsmdetail_back found!' );
				setUIControlfromMask( button, mask.back );
			}
			if (button.getId() === 'emailview_action') {
				console.log( 'itsmdetail_edit found!' );
				setUIControlfromMask( button, mask.ctrls );
			}
		});
	},
});
