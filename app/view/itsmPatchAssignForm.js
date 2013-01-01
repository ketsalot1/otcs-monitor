Ext.define("itsm.view.itsmPatchAssignForm", {
	extend: "Ext.form.Panel",
	alias: "widget.itsmpatchform",
	config: {
		title: 'Assign to Patch',
		id: 'patchFormId',
		iconCls: 'refresh',
		layout: 'vbox'
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var casePatch = {
			xtype: 'selectfield',
			label: 'Patch:',
			name: 'patch',
			labelWidth: '32%',
			store: Ext.getStore('patches')
			/*
			options: [
				{ text: "WEV-0975-011", value: 1},
				{ text: "WEV-1020-004", value: 2},
				{ text: "WIV-0970-022", value: 3},
				{ text: "ESC-0971-008", value: 4}
			]
			*/
		};

		var removeLinks = {
			xtype: 'togglefield',
			name: 'unlink',
			label: 'Drop other links?',
			labelWidth: '62%',
		};

		var backButton = {
			xtype: 'button',
//			text: 'Back',
//			ui: 'back',
			ui: 'action',
			iconCls: 'delete1',
			iconMask: true,
			listeners: {
				tap: { fn: this.onBackButtonTap, scope: this }
			}
		};

		var saveButton = {
			xtype: 'button',
//			iconCls: 'doc_send',
			iconCls: 'check2',
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
			instructions: 'The case will be linked with the patch you selected from the picker control. If you want to link the case with the selected patch only, use the switch "drop other links".',
			items: [
				casePatch,
				removeLinks 
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

		this.setValues( {caseNo: 'WEV-0975-011' } );
		console.log( 'searchPanel init' );
    },
	 // >>>

	onSaveButtonTap: function() {
		var cn = {};
		try {
			cn.patch = this.getFields().patch.getValue();
			cn.drop = this.getFields().unlink.getValue();
			if( cn.patch.length == 0 ) {
			  throw( { name: "Form Exception", message: 'The length of the patch number is zero' } );	
			}
			console.log("view.PatchForm.saveButtonTap: Patch code >" + cn.patch + "<, unlink >" + cn.drop + "<" );
			this.fireEvent('linkCaseCommand', opentext.data.activeCase, cn );
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
		console.log("view.PatchForm.backButtonTap" );
		this.fireEvent('backCaseLinkCommand' );
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

