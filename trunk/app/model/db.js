Ext.define('itsm.model.db', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{ name: 'code', type: 'string' },
			{ name: 'message', type: 'string' },
		]
   }
});
