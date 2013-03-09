Ext.define('itsm.store.count', {
//	requires: [
//		'Ext.data.proxy.JsonP',
//   	'Ext.data.proxy.LocalStorage',
//	],
	extend: 'Ext.data.Store',
	config : {
		model: 'itsm.model.count',
		autoLoad: false,
		proxy: {
			type: 'jsonp',
//			url: 'http://localhost:18080/jsfks/sencha?otcs=json&data02=wole',
			url: 'http://localhost/nd?otcs=Ganesh',
			callbackKey: 'processSupportData',
			reader: {
				type: 'json',
				rootProperty: 'support_data.feed.entries'
			}
		}
	}
});
