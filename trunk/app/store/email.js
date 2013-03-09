Ext.define('itsm.store.email', {
//	requires: [
//		'Ext.data.proxy.JsonP',
//   	'Ext.data.proxy.LocalStorage',
//	],
	extend: 'Ext.data.TreeStore',
	config : {
		model: 'itsm.model.email',
/* <<<
		defaultRootProperty: 'items',
		root : {
			items: [
			{ case: "147446", description: "ITSM Ticket 147446: Cannot save annotation in WinViewer 10.0.0", status: "feedback pending", details: "28.10.2012 - Test binary submitted<br/>21.10.2012 - Problem analysed in detail. Root cause identified, test binary planned for next week.", leaf: true },
			{ case: "147447", description:"ITSM Ticket 147447: Error when archiving from Scan into CS", status: "feedback received", details: "28.10.2012 - Test binary will be submitted by end of week<br/>21.10.2012 - Problem scheduled for analysis. Root cause unknown as of now.", leaf: true },
			{ case: "147448", description:"ITSM Ticket 147448: Error when archiving from Scan into CS", status: "feedback received", details: "28.10.2012 - Test binary will be submitted by end of week<br/>21.10.2012 - Problem scheduled for analysis. Root cause unknown as of now.", leaf: true  },
			{ case: "147449", description:"ITSM Ticket 147449: Error when archiving from Scan into CS", status: "feedback received", details: "28.10.2012 - Test binary will be submitted by end of week<br/>21.10.2012 - Problem scheduled for analysis. Root cause unknown as of now.", leaf: true  },
			{ case: "147450", description:"ITSM Ticket 147450: Error when archiving from Scan into CS", status: "feedback received", details: "28.10.2012 - Test binary will be submitted by end of week<br/>21.10.2012 - Problem scheduled for analysis. Root cause unknown as of now.", leaf: true  },
			{ case: "147451", description:"ITSM Ticket 147451: Error when archiving from Scan into CS", status: "feedback received", details: "28.10.2012 - Test binary will be submitted by end of week<br/>21.10.2012 - Problem scheduled for analysis. Root cause unknown as of now.", leaf: true  },
			{ case: "147452", description:"ITSM Ticket 147452: Error when archiving from Scan into CS", status: "feedback received", details: "28.10.2012 - Test binary will be submitted by end of week<br/>21.10.2012 - Problem scheduled for analysis. Root cause unknown as of now.", leaf: true  },
			{ case: "147453", description:"ITSM Ticket 147453: Error when archiving from Scan into CS", status: "feedback received", details: "28.10.2012 - Test binary will be submitted by end of week<br/>21.10.2012 - Problem scheduled for analysis. Root cause unknown as of now.", leaf: true  },
			{ case: "147454", description:"ITSM Ticket 147454: Error when archiving from Scan into CS", status: "feedback received", details: "28.10.2012 - Test binary will be submitted by end of week<br/>21.10.2012 - Problem scheduled for analysis. Root cause unknown as of now.", leaf: true  },
			{ case: "147455", description:"ITSM Ticket 147455: Error when archiving from Scan into CS", status: "feedback received", details: "28.10.2012 - Test binary will be submitted by end of week<br/>21.10.2012 - Problem scheduled for analysis. Root cause unknown as of now.", leaf: true  },
			{ case: "147456", description:"ITSM Ticket 147456: Error when archiving from Scan into CS", status: "feedback received", details: "28.10.2012 - Test binary will be submitted by end of week<br/>21.10.2012 - Problem scheduled for analysis. Root cause unknown as of now.", leaf: true  },
			{ case: "147457", description:"ITSM Ticket 147457: Error when archiving from Scan into CS", status: "feedback received", details: "28.10.2012 - Test binary will be submitted by end of week<br/>21.10.2012 - Problem scheduled for analysis. Root cause unknown as of now.", leaf: true  },
			{ case: "147458", description:"ITSM Ticket 147458: Error when archiving from Scan into CS", status: "feedback received", details: "28.10.2012 - Test binary will be submitted by end of week<br/>21.10.2012 - Problem scheduled for analysis. Root cause unknown as of now.", leaf: true  }
		]}
 >>> */

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
