Ext.define("itsm.store.settings", {
	extend: "Ext.data.Store",
//	requires:"Ext.data.proxy.LocalStorage",
	config: {
		model: "itsm.model.settings",
		autoLoad: false
//		data: [
//			{ 'hostName': 'http://localhost/nd' }
//		]
	}
});
