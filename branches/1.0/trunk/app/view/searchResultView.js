Ext.define("itsm.view.searchResultView", {
	extend: "Ext.Container",
	alias: "widget.searchresultview",
	config: {
		layout: {
			type: 'fit'
		}
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var backButton = {
			xtype: "button",
			ui: "action",
			text: "Back",
			listeners: {
				tap: { fn: this.onBackButtonTap, scope: this }
			}
		};

		var topToolbar = {
			xtype: "toolbar",
			title: 'Search OTCS Case',
			docked: "top",
			items: [
				backButton,
				{ xtype: "spacer" }
			]
		};

		var searchResultPanel = {
			xtype: "searchresultdetail",
			store: Ext.getStore("searchresult")
		};

		this.add([topToolbar,searchResultPanel]);
    },
	 // >>>

	onBackButtonTap: function () {
		console.log("view.searchResultView.back");
		this.fireEvent('searchBackCommand', this );
	}

/* <<<

	onDeleteButtonTap: function (list, record, target, index, evt, options) {
		console.log("view.NotesListContainer_1.DeleteNoteTap");
		Ext.Msg.confirm( "Delete", "Delete selected note?", function(button) {
			if( button == "yes" ) {
				this.fireEvent('deleteNoteCommand', this);
			}
		}, this );
	},

	deleteConfirm: function(button) {
		Ext.Msg.alert(button.id);
	},

	onAboutButtonTap: function () {
		console.log("view.NotesListContainer_1.AboutButtonTap");
		this.fireEvent('aboutCommand', this );
	}
 >>> */
});

