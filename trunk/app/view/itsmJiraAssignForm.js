Ext.define("itsm.view.itsmJiraAssignForm", {
	extend: "Ext.form.Panel",
	alias: "widget.itsmjiraform",
	config: {
		title: 'Link case with Jira ID',
		id: 'itsmJiraAssignFormId',
		iconCls: 'refresh',
		layout: 'vbox',
		scrollable: false
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var jiraID = {
			xtype: 'textfield',
			label: 'Jira ID:',
			name: 'jiraid',
			labelWidth: '32%'
		};

		var formFrame = {
			xtype: 'fieldset',
			title: 'Link Jira',
			instructions: 'Enter the Jira ID. The OTCS Ticket will be linked with the specifiec Jira ID.',
			items: [
				jiraID
			]
		};	

		this.add([formFrame]);

		this.setValues( {jiraid: "VIEW-132" } );

		console.log( 'itsmJiraAssignForm init' );
    },
	 // >>>

});
