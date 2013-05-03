Ext.define("itsm.view.searchForm", {
	extend: "Ext.form.Panel",
	alias: "widget.searchform",
	config: {
		title: 'Search',
		id: 'searchFormId',
		iconCls: 'refresh',
		layout: 'vbox',
		scrollable: false
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var searchCase = {
			xtype: 'textfield',
			label: 'Case No. or Text:',
			name: 'caseNo',
			labelWidth: '33%'
		};

		var searchAll = {
			xtype: 'togglefield',
			name: 'searchAll',
			label: 'Search closed?',
			labelWidth: '33%',
		};

		var searchAsText = {
			xtype: 'togglefield',
			name: 'searchAsText',
			label: 'Full Text Search?',
			labelWidth: '33%',
		};

		var searchButton = {
			xtype: 'button',
			text: 'Search',
			iconCls: 'search',
			iconMask: true,
			ui: 'round',
			listeners: {
				tap: { fn: this.onSearchButtonTap, scope: this }
			}
		};

		var searchButtonPanel = {
			xtype: 'toolbar',
			docked: 'bottom',
			layout: { pack: 'center' },
			items: [
				searchButton
			]
		};

		var formFrame = {
			xtype: 'fieldset',
			title: 'OTCS Case Search',
			instructions: 'Search for specific OTCS ticket. Enter the 5 digit number and press search button. Use "search all" toggle field if you want include in search archived cases. Use switch "Full Text Search to search the tickets for specific pattern.',
			items: [
				searchCase,
				searchAll,
				searchAsText
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

	onSearchButtonTap: function() {
		var cn = {};
		try {
			cn.caseNo = this.getFields().caseNo.getValue();
			cn.searchAll = this.getFields().searchAll.getValue();
			cn.searchAsText = this.getFields().searchAsText.getValue();
			if( cn.caseNo.length == 0 ) {
			  throw( { message: 'No search pattern' } );	
			}
			console.log("view.searchForm.searchButtonTap: >" + cn.caseNo + "<" );
			this.fireEvent('searchCaseCommand', cn );
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

