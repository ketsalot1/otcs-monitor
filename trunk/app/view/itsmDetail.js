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

	config:{
		id: 'itsmDetail',
		fullscreen: true,
		scrollable:'vertical',
		title: 'OTCS Monitor',
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
				listeners: {
					tap: { fn: this.onDetailLink, scope: this }
				}
        };

        var bottomToolbar = {
            xtype: "toolbar",
            docked: "bottom",
//            title: "OTCS Monitor",
            items: [
					backButton,
					{ xtype: 'spacer' },
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
									console.log('nestedList.itemtap event');
//                  			this.getDetailCard().setHtml(post.get('description') + '<br/><div class="list-item-underlined">&nbsp;<br/></div>' + post.get('status') + '<br/><div class="list-item-underlined">&nbsp;</div><br/>' + post.get('details'));
                  			this.getDetailCard().setHtml(post.get('case') + '<br/><br/>' + post.get('status') + '<br/><br/>' + post.get('patches') + '<br/><br/>' + post.get('details'));
									opentext.data.activeCase = { 'case': post.get('case'), 'id': post.get('id') }; 
									this.getParent().getItems().items[2].getItems().items[0].hide();
									this.getParent().getItems().items[2].getItems().items[3].show();
									this.getParent().getItems().items[2].getItems().items[2].show();
					},
					back: function() {
									console.log('nestedList.back event');
//   								this.callParent(arguments);
									this.getParent().getItems().items[2].getItems().items[0].show();
									this.getParent().getItems().items[2].getItems().items[3].hide();
									this.getParent().getItems().items[2].getItems().items[2].hide();
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
		console.log("view.itsmDetail.Back");
		this.getItems().items[2].getItems().items[3].hide();
		this.getItems().items[2].getItems().items[2].hide();
		this.fireEvent("detailBackCommand", this);
	},

	onDetailEdit: function() {
		console.log("view.itsmDetail.Edit");
		if( typeof opentext.data.activeCase == 'object' ) { 
			this.getItems().items[2].getItems().items[0].show();
			this.getItems().items[2].getItems().items[3].hide();
			this.getItems().items[2].getItems().items[2].hide();
			this.fireEvent("detailEditCommand", opentext.data.activeCase);
		} else {
			console.error("No case selected");
		}
	},

	onDetailLink: function() {
		console.log("view.itsmDetail.Link");
		if( typeof opentext.data.activeCase == 'object' ) { 
			this.getItems().items[2].getItems().items[0].show();
			this.getItems().items[2].getItems().items[3].hide();
			this.getItems().items[2].getItems().items[2].hide();
			this.fireEvent("detailLinkPatchCommand", opentext.data.activeCase);
		} else {
			console.error("No case selected");
		}
	}

});
