Ext.define('itsm.store.db', {
	extend: 'Ext.data.Store',
	config : {
		model: 'itsm.model.db',
		autoLoad: false,
		proxy: {
			type: 'jsonp',
			url: 'http://localhost/nd?cmd=update',
			callbackKey: 'processSupportData',
			reader: {
				type: 'json',
				rootProperty: 'support_data.feed.entries'
			}
		}
	}
});
