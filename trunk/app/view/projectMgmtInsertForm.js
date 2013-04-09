Ext.define("itsm.view.projectMgmtInsertForm", {
	extend: "Ext.form.Panel",
	alias: "widget.projectmgmtinsertform",
	config: {
		title: 'Create new Project',
		id: 'projectMgmtInsertForm',
		iconCls: 'refresh',
		layout: 'vbox',
		scrollable: false // prevent the form pannel to move around when using carousel control. Smooth transition
								// check on small display, if the from does not need scrolling though.
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var projectName = {
			xtype: 'textfield',
			label: 'Project:',
			name: 'name',
			labelWidth: '25%'
		};

		var projectDescription = {
			xtype: 'textareafield',
			label: 'Descr.:',
			name: 'description',
			labelWidth: '25%'
		};

		var projectCategory = {
			xtype: 'selectfield',
			label: 'Category:',
			name: 'category',
			labelWidth: '25%',
			options: [
				{ text: "Maintenance", value: "OTCS Cases" },
				{ text: "Current Version", value: "Projects" },
				{ text: "Miscellaneous", value: "Miscellaneous" }
			]
		};

		var formFrame = {
			xtype: 'fieldset',
			title: 'New Project',
			instructions: 'Enter the name and description of a new project. Select one of the available categories. The project will get a unique ID automatically.',
			items: [
				projectName,
				projectDescription,
				projectCategory,
			]
		};	

		this.add([formFrame]);

		this.setValues( {name: "Sharepoint", description: "Application Governance and Archiving for SharepPoint" } );
    },
	 // >>>
});

