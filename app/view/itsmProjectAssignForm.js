Ext.define("itsm.view.itsmProjectAssignForm", {
	extend: "Ext.form.Panel",
	alias: "widget.itsmprojectassignform",
	config: {
		title: 'Assign to Project',
		id: 'projectFormId',
		iconCls: 'refresh',
		layout: 'vbox'
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var projectCtrl = {
			xtype: 'selectfield',
			label: 'Project:',
			name: 'project',
			labelWidth: '32%',
			// TODO - can I recycle patches??
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

		var backButton = {
			xtype: 'button',
			text: 'Back',
			ui: 'back',
//			ui: 'action',
//			iconCls: 'delete1',
//			iconMask: true,
			listeners: {
				tap: { fn: this.onBackButtonTap, scope: this }
			}
		};

		var saveButton = {
			xtype: 'button',
			text: 'OK',
			ui: 'action',
//			iconCls: 'check2',
//			iconMask: true,
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
			instructions: 'The case will be linked with the project you selected from the picker control.',
			items: [
				projectCtrl
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
			cn.projectId = this.getFields().project.getValue();
			if( cn.projectId.length == 0 ) {
			  throw( { name: "Form Exception", message: 'The project number is invalid' } );	
			}
			console.log("view.ProjectForm.saveButtonTap: Project code >" + cn.projectId + "<" );
			this.fireEvent('linkProjectCaseCommand', opentext.data.activeCase, cn );
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

