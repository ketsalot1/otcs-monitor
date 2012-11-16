Ext.define("itsm.model.searchresult", {
    extend: "Ext.data.Model",
    config: {
        fields: [
				{ name: 'case', type: 'string' },
				{ name: 'description', type: 'string' },
		   	{ name: 'status', type: 'string' },
		   	{ name: 'details', type: 'string' }
        ]
    }
});
