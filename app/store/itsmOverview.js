Ext.define('itsm.store.itsmOverview', {
//	requires: [
//		'Ext.data.proxy.JsonP',
//   	'Ext.data.proxy.LocalStorage',
//	],
	extend: 'Ext.data.Store',
	config : {
		model: 'itsm.model.itsmOverview',
/* <<< 
		data: [
			{ case_total: 64, case_pending: 4, case_closed: 12, case_delta_w2w: -4, case_delta_m2m: 3, patches_total: 12 }
		]
  >>> */

		autoLoad: false,
		proxy: {
			type: 'jsonp',
//			url: 'http://localhost:18080/jsfks/sencha?otcs=json&data02=wole',
			url: 'http://localhost/otcsdata?cmd=get_overview&data={"n":"n"}',
			callbackKey: 'processSupportData',
			reader: {
				type: 'json',
				rootProperty: 'support_data.feed.entries'
			}
		}
	}

	/*
	init: function() {
		console.log('store.itsm.init');
		try {
			this.callParent();
		}
		catch(e) {
			console.error( 'store.itsm.init:' + e.name + " - " + e.message );
		}
	}	
	*/
});
