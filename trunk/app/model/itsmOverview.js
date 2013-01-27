Ext.define('itsm.model.itsmOverview', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{ name: 'case_total', type: 'int' },
			{ name: 'case_pending', type: 'int' },
		   { name: 'case_closed', type: 'int' },
		   { name: 'case_delta_w2w', type: 'int' },
		   { name: 'case_delta_m2m', type: 'int' },
		   { name: 'patches_total', type: 'int' },
		]
   }
});
