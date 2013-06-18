Ext.define("itsm.view.itsmRefLinkForm", {
	extend: "Ext.form.Panel",
	alias: "widget.itsmreferenceform",
	config: {
		title: 'Create reference to another Jira entry',
		id: 'itsmReferenceLinkFormId',
		iconCls: 'refresh',
		layout: 'vbox',
		scrollable: false
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var refid = {
			xtype: 'textfield',
			label: 'Jira ID:',
			name: 'refID',
			labelWidth: '32%'
		};

		var formFrame = {
			xtype: 'fieldset',
			title: 'Create reference to another Jira entry',
			instructions: 'Enter Jira ID to link this case with. This creates a reference that can be used for fast navigation among related topics.',
			items: [
				refid
			]
		};	

		this.add([formFrame]);

		this.setValues( {refID: "VIEW-211" } );

		console.log( 'itsmRefLinkForm init' );
    },
	 // >>>

});
