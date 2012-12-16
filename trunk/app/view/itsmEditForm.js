Ext.define("itsm.view.itsmEditForm", {
	extend: "Ext.form.Panel",
	alias: "widget.itsmeditform",
	config: {
		title: 'Edit Case',
		id: 'editFormId',
		iconCls: 'refresh',
		layout: 'vbox'
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var caseText = {
			xtype: 'textfield',
			label: 'Update:',
			name: 'caseText',
			labelWidth: '29%'
		};

		var backButton = {
			xtype: 'button',
			text: 'Back',
			ui: 'back',
			listeners: {
				tap: { fn: this.onBackButtonTap, scope: this }
			}
		};

		var saveButton = {
			xtype: 'button',
			iconCls: 'doc_send',
			iconMask: true,
			ui: 'action',
			listeners: {
				tap: { fn: this.onSaveButtonTap, scope: this }
			}
		};

		var searchButtonPanel = {
			xtype: 'toolbar',
			docked: 'bottom',
			layout: { pack: 'center' },
			items: [
				backButton,
				{ xtype: 'spacer'},
				saveButton
			]
		};

		var formFrame = {
			xtype: 'fieldset',
			title: 'OTCS Case Update',
			instructions: 'The text you type will be added to the description of the case in the central database.',
			items: [
				caseText
			]
		};	

		this.add([formFrame,searchButtonPanel]);

/*
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
*/

		this.setValues( {caseNo: '147665' } );
		console.log( 'searchPanel init' );
    },
	 // >>>

	onSaveButtonTap: function() {
		var cn = "";
		try {
			cn = this.getFields().caseText.getValue();
			if( cn.length == 0 ) {
			  throw( { message: 'The length of the number is zero' } );	
			}
			console.log("view.EditForm.saveButtonTap: >" + cn + "<" );
			this.fireEvent('saveCaseCommand', opentext.data.activeCase, cn );
		}
		catch(e) {
			console.error( e.message );
			Ext.Msg.alert( e.message );
		}
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

	onBackButtonTap: function() {
		console.log("view.EditForm.backButtonTap" );
		this.fireEvent('backCaseEditCommand' );
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
 >>> */
});

