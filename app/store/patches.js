Ext.define('itsm.store.patches', {
	extend: 'Ext.data.Store',
	config : {
		model: 'itsm.model.patches',
		autoLoad: false,
		proxy: {
			type: 'jsonp',
//			url: 'http://localhost:18080/jsfks/sencha?otcs=json&data02=wole',
			url: 'http://localhost/nd?cmd=patches&data=open',
			callbackKey: 'processSupportData',
			reader: {
				type: 'json',
				rootProperty: 'support_data.feed.entries'
			}
		}
	}
});
