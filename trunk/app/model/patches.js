Ext.define('itsm.model.patches', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{ name: 'text', type: 'string' },
			{ name: 'value', type: 'int' },
			{ name: 'eta', type: 'date' }
		]
   }
});
