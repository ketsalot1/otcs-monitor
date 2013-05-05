Ext.define("itsm.view.setCaseStatusForm", {
	extend: "Ext.form.Panel",
	alias: "widget.setcasestatusform",
	config: {
		title: 'Set Sratus',
		id: 'setCaseStatusFormId',
		iconCls: 'refresh',
		layout: 'vbox',
		scrollable: false // prevent the form pannel to move around when using carousel control. Smooth transition
								// check on small display, if the from does not need scrolling though.
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var stat = {
			xtype: 'selectfield',
			label: 'Status:',
			name: 'status',
			labelWidth: '32%',
//			store: Ext.getStore('status')
			options: [
				{ text: "Closed", value: "Closed"},
				{ text: "Progress To-Do", value: "Progress To-Do"},
				{ text: "Feedback", value: "Feedack"}
			]
		};

		var formFrame = {
			xtype: 'fieldset',
			title: 'Set Status',
			instructions: 'Set the status of the case.',
			items: [
				stat
			]
		};	

		this.add([formFrame]);

		this.setValues( {status: 'Feedback' } );
		console.log( 'setStatusInit init leaving' );
    },
	 // >>>

});

