Ext.define("itsm.store.dashboard", {
	extend: "Ext.data.Store",
/* <<<
	// Debuggin version. Without connection to source
	// delivers basic data structure
	requires: "Ext.data.proxy.LocalStorage",
	config: {
		model: "itsm.model.itsm",
		data: [
			{ category: "Desktop", title: "ITSM Cases", code: "Ganesh" },
			{ category: "Desktop", title: "Patches", code: "WIV" },
			{ category: "Scan", title: "ITSM Cases", code: "Husain" },
			{ category: "Scan", title: "Patches", code: "ESC" },
			{ category: "WebViewer", title: "ITSM Cases", code: "Pavana" },
			{ category: "WebViewer", title: "Patches", code: "WEV" }
		],
		sorters: [{ property: 'category', direction: 'DESC'}],
		grouper: {
			sortProperty: "category",
			direction: "DESC",
			groupFn: function (record) {
				if (record && record.data.category) {
					return record.data.category;
				} else {
					return '';
				}
			}
		}
	}
 >>> */

	config : {
		model: 'itsm.model.itsm',
/* <<<
		defaultRootProperty: 'items',
		root : {
			items: [
			{ case: "147446", description: "ITSM Ticket 147446: Cannot save annotation in WinViewer 10.0.0", status: "feedback pending", details: "28.10.2012 - Test binary submitted<br/>21.10.2012 - Problem analysed in detail. Root cause identified, test binary planned for next week.", leaf: true },
			{ case: "147447", description:"ITSM Ticket 147447: Error when archiving from Scan into CS", status: "feedback received", details: "28.10.2012 - Test binary will be submitted by end of week<br/>21.10.2012 - Problem scheduled for analysis. Root cause unknown as of now.", leaf: true }
		]}
 >>> */

		autoLoad: false,
		proxy: {
			type: 'jsonp',
//			url: 'http://localhost:18080/jsfks/sencha?otcs=Descriptor&data02=wole',
			url: 'http://localhost/nd?cmd=help&p=help',
			callbackKey: 'processSupportData',
			reader: {
				type: 'json',
				rootProperty: 'support_data.feed.entries'
			}
		},

		sorters: [{ property: 'category', direction: 'ASC'}],
		grouper: {
			sortProperty: "category",
			direction: "ASC",
			groupFn: function (record) {
				if (record && record.data.category) {
					return record.data.category;
				} else {
					return '';
				}
			}
		}
	}
});

