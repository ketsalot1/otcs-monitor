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

		var formFrame = {
			xtype: 'fieldset',
			title: 'Assign to patch',
			instructions: 'The case will be linked with the patch you selected from the picker control. If you want to link the case with the selected patch only, use the switch "drop other links".',
			items: [
				casePatch,
				removeLinks 
			]
		};	

		this.add([formFrame]);

		this.setValues( {caseNo: 'WEV-0975-011' } );
		console.log( 'searchPanel init' );
    },
	 // >>>
});

