Ext.define("itsm.view.patchMgmtInsertForm", {
	extend: "Ext.form.Panel",
	alias: "widget.patchmgmtinsertform",
	config: {
		title: 'Create a Patch',
		id: 'patchMgmtInsertForm',
		iconCls: 'refresh',
		layout: 'vbox',
		scrollable: false // prevent the form pannel to move around when using carousel control. Smooth transition
								// check on small display, if the from does not need scrolling though.
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var patch = {
			xtype: 'textfield',
			label: 'Patch:',
			name: 'patch',
			labelWidth: '32%'
		};

		var formFrame = {
			xtype: 'fieldset',
			title: 'New Patch',
			instructions: 'Enter the name of the new patch. The patch status and ETA will be set first after the patch gets created in this step.',
			items: [
				patch
			]
		};	

		this.add([formFrame]);

		this.setValues( {patch: "WEV-1020-099" } );
    },
	 // >>>

});

