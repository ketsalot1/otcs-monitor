Ext.define('itsm.model.desktopITSM', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{ name: 'icon', type: 'string' },
			{ name: 'case', type: 'string' },
			{ name: 'description', type: 'string' },
		   { name: 'status', type: 'string' },
		   { name: 'details', type: 'string' },
		   { name: 'patches', type: 'string' },
		   { name: 'jira', type: 'string' },
		   { name: 'project', type: 'string' },
		   { name: 'id', type: 'int' }
		]
   }
});
