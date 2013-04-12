Ext.define("itsm.view.itsmCaseLinkForm", {
	extend: "Ext.form.Panel",
	alias: "widget.itsmcaseform",
	config: {
		title: 'Link case with another case',
		id: 'itsmCaseLinkFormId',
		iconCls: 'refresh',
		layout: 'vbox',
		scrollable: false
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var caseno = {
			xtype: 'textfield',
			label: 'Case No:',
			name: 'caseno',
			labelWidth: '32%'
		};

		var formFrame = {
			xtype: 'fieldset',
			title: 'Link to reworked Case',
			instructions: 'Enter Case No. of the referrenced case. By establishing the reference you indicate that the curretn case is a re-work for the referrenced case.',
			items: [
				caseno
			]
		};	

		this.add([formFrame]);

		this.setValues( {caseno: "1657781" } );

		console.log( 'itsmCaseLinkForm init' );
    },
	 // >>>

});
