Ext.define('itsm.model.email', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{ name: '_id', type: 'string' },
			{ name: 'caseNo', type: 'string' },
			{ name: 'mailSubject', type: 'string' },
		   { name: 'mailSender', type: 'string' },
		   { name: 'sentOn', type: 'string' },
		   { name: 'mailHTMLBody', type: 'string' },
		   { name: 'icon', type: 'string' }
		]
   }
});
