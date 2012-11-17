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
		title: 'OTCS Monitor'
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

        var bottomToolbar = {
            xtype: "toolbar",
            docked: "bottom",
            title: "OTCS Monitor",
            items: [
					backButton
		  		]
        };

		  var detailPanel = {
			   id: 'detailPanel',
			 	xtype: 'nestedlist',
				title: 'OTCS Cases',
				displayField: 'description',
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
                  			this.getDetailCard().setHtml(post.get('description') + '<br/><br/>' + post.get('status') + '<br/><br/>' + post.get('details'));
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
		this.fireEvent("detailBackCommand", this);
	}
});
