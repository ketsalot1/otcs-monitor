Ext.define('itsm.model.itsmOverview', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{ name: 'case_total', type: 'int' },
			{ name: 'case_opened_week_count', type: 'int' },
		   { name: 'case_closed_week_count', type: 'int' },
		   { name: 'case_closed_week_avg', type: 'string' },
			{ name: 'case_opened_month_count', type: 'int' },
		   { name: 'case_closed_month_count', type: 'int' },
		   { name: 'case_closed_month_avg', type: 'string' },
		   { name: 'patches_total', type: 'int' },
		]
   }
});
