Ext.define("itsm.view.itsmEditForm", {
	extend: "Ext.form.Panel",
	alias: "widget.itsmeditform",
	config: {
		title: 'Edit Case',
		id: 'editFormId',
		iconCls: 'refresh',
		layout: 'vbox'
	},

	requires: [
		"Ext.form.FieldSet",
		"Ext.form.Toggle",
		"Ext.field.Select"
	],

	initialize: function () { // <<<
		this.callParent(arguments);

		var caseText = {
			xtype: 'textareafield',
			label: 'Update:',
			name: 'caseText',
			labelWidth: '25%',
			minHeight: '7em'
		};

		var toggleSynopsis = {
			xtype: 'togglefield',
			name: 'toggleSynopsis',
			label: 'Replace synopsis?',
			labelWidth: '25%',
		};

		var caseSynopsis = {
			xtype: 'textareafield',
			label: 'Synopsis:',
			name: 'caseSynopsis',
			labelWidth: '25%',
			minHeight: '7em'
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
//			iconCls: 'doc_send',
//			iconMask: true,
			text: 'OK',
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
			instructions: 'The text you type in Update field will be time stamped and added to the chronicles. Additionanly you can change the synopsis of the case in the database.',
			items: [
				caseText,
				toggleSynopsis,
				caseSynopsis
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
		var cn = {};
		try {
			cn.chronicle = this.getFields().caseText.getValue();
			cn.synopsis = this.getFields().caseSynopsis.getValue();
			cn.flagUseSynopsis = this.getFields().toggleSynopsis.getValue();
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

