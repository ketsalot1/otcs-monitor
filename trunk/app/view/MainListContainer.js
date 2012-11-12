Ext.define("itsm.view.MainListContainer", {
	extend: "Ext.Container",
	alias: "widget.mainlistcontainer",
	config: {
		layout: {
			type: 'fit'
		}
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var settingsButton = {
			xtype: "button",
			ui: "action",
			text: "Settings",
			listeners: {
				tap: { fn: this.onSettingsButtonTap, scope: this }
			}
		};

		var topToolbar = {
			xtype: "toolbar",
			title: 'OTCS Monitor',
			docked: "top",
			items: [
				{ xtype: "spacer" },
				settingsButton
			]
		};

		var itsmList = {
			xtype: "itsmlist",
			store: Ext.getStore("itsm"),
			listeners: {
				disclose: { fn: this.onNotesListDisclose, scope: this }
			}
		};

		var settings = Ext.getStore('settings');
		var rec = settings.getAt(0);
		var data = [];
		try {
			data = rec.get('settingsContainer');
			var hostName = data[0];

			var s = Ext.getStore("itsm");
			s.getProxy().setUrl( hostName + '?otcs=Descriptor' );
			console.log( 'controller: setting Descriptors URL=' + s.getProxy().getUrl() );
			s.load();
		} 
		catch(e) {
			console.error('Configuration purged or not saved yet')
			Ext.Msg.alert("Configure the application first");
		}

		this.add([topToolbar,itsmList]);
    },
	 // >>>

	onNotesListDisclose: function (list, record, target, index, evt, options) {
		console.log("view.mainListContainer.disclose");
		this.fireEvent('itsmDetailCommand', this, record.data.code);
	},

	onSettingsButtonTap: function () {
		console.log("view.mainListContainer.SettingsButtonTap");
		this.fireEvent('settingsCommand', this );
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

