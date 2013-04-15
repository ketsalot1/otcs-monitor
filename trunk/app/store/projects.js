Ext.define('itsm.store.projects', {
	extend: 'Ext.data.Store',
	config : {
		model: 'itsm.model.patches',
		autoLoad: false,
		proxy: {
			type: 'jsonp',
			url: 'http://localhost/nd?cmd=projects&data=open',
			callbackKey: 'processSupportData',
			reader: {
				type: 'json',
				rootProperty: 'support_data.feed.entries'
			}
		}
	}
});
