Ext.define('itsm.model.desktopITSM', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{ name: 'case', type: 'string' },
			{ name: 'description', type: 'string' },
		   { name: 'status', type: 'string' },
		   { name: 'details', type: 'string' }
		]
   }
});
