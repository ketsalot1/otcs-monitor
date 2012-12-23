Ext.define("itsm.model.settings", {
	extend: "Ext.data.Model",
	config: {
		fields: [ 'settingsContainer' ],
//			{ name: 'configurationContainer', type: 'string' }
//		],
//		validations: [
//			{ type: 'presence', field: 'hostName' }
//		],
		proxy: {
			type: 'localstorage',
			id: 'new-otcs-monitor-settings',
			reader: {
				type: 'json',
				rootProperty: 'settingsContainer'
			}
		}
	 }
});
