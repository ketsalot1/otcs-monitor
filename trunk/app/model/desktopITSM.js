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
		   { name: 'reference', type: 'string' },
		   { name: 'project', type: 'string' },
		   { name: 'rework', type: 'int' },
		   { name: 'synopsis', type: 'string' },
		   { name: 'checkpoint', type: 'string' },
		   { name: 'start', type: 'string' },
		   { name: 'stop', type: 'string' },
		   { name: 'age', type: 'string' },
		   { name: 'id', type: 'int' },
		   { name: 'patchId', type: 'int' }
		]
   }
});
