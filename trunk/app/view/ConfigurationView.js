Ext.define("itsm.view.ConfigurationView", {
	extend: "Ext.form.Panel",
	alias: "widget.configurationview",
	config: {
		title: 'Settings',
		id: 'infoSubmitForm',
		iconCls: 'refresh',
		layout: 'vbox',
		scrollable: false
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var serviceAddress = {
			xtype: 'textfield',
			label: 'Service:',
			name: 'hostName',
			labelWidth: '25%'
		};

		var saveButton = {
			xtype: 'button',
			text: 'Save',
//			action: 'save',
//			ui: 'confirm',
			listeners: {
				tap: { fn: this.onSaveButtonTap, scope: this }
			}
		};

		var purgeButton = {
			xtype: 'button',
			text: 'Purge',
			listeners: {
				tap: { fn: this.onPurgeButtonTap, scope: this }
			}
		};

		var backButton = {
			xtype: 'button',
			text: 'Back',
			ui: 'back',
			listeners: {
				tap: { fn: this.onBackButtonTap, scope: this }
			}
		};

		var saveButtonPanel = {
			xtype: 'toolbar',
			docked: 'bottom',
//			layout: { pack: 'center' },
			items: [
				backButton,
				{ xtype: 'spacer'},
				purgeButton,
				saveButton
			]
		};

		var formFrame = {
			xtype: 'fieldset',
			title: 'OTCS Service Address',
			instructions: 'OTCS Service is an URL hosting JSON data objects. The service is either Tomcat based application or nodejs. Both exist and are supported. The data originates in the PMCC system.',
			items: [
				serviceAddress
			]
		};	

		this.add([formFrame,saveButtonPanel]);

		var settings = Ext.getStore("settings");
		var rec = settings.getAt(0);
		var data = [];
		var init;
		try {
			data = rec.get('settingsContainer');
			init = data[0];
		}
		catch(e) {
			console.error("Application is not configured yet");
			init = 'http://server:port/nd';
		}

		console.log( 'ConfigurationView: ' + init );

		this.setValues( {hostName: init } );
    },
	 // >>>

	onSaveButtonTap: function() {
		console.log("view.ConfigurationView.saveButtonTap: >" + this.getFields().hostName.getValue() + "<" );
		this.fireEvent('saveSettingsCommand', this.getFields().hostName.getValue() );

/*
		var form = this.up('formpanel');
		form.submit({
			success: function() {
				Ext.Msg.alert('Form submitted', function() {
					form.reset();
				});
			}
		});
*/
	},

	onPurgeButtonTap: function() {
		console.log("view.ConfigurationView.purgeButtonTap");
		this.fireEvent('purgeSettingsCommand', this );
	},						

	onBackButtonTap: function() {
		console.log("view.ConfigurationView.purgeButtonTap");
		this.fireEvent('backSettingsCommand', this );
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

