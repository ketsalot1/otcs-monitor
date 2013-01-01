Ext.define("itsm.controller.itsm", {
	extend: "Ext.app.Controller",

	slideLeftTransition: { 
			type: 'slide', 
			direction: 'left' 
	},

	slideRightTransition: { 
			type: 'slide', 
			direction: 'right'
	},

	config: {
		refs: {
				// We're going to lookup our views by xtype. This is added 
				// throug the property 'alias' in the view definition.
				mainListContainer: "mainlistcontainer",
				itsmList: "itsmlist",
				itsmDetail: "itsmdetail",
				configurationView: "configurationview",
				searchForm: "searchform",
				itsmOverview: "itsmoverview",
				itsmEditForm: "itsmeditform",
				itsmPatchAssignForm: "itsmpatchform",
				patchMgmtView: "patchmainview"
		},
		control: {
				mainListContainer: {
					// The commands fired by the notes list container.
					itsmDetailCommand: "onITSMDetail",
					settingsCommand: "onSettings",
					patchMgmtCommand: "onPatchMgmt",
					searchCommand: "onSearch",
					initImageCommand: "onInitImages",
					swapChartCommand: "onChartSwap"
				},
				itsmDetail: {
					detailBackCommand: "onBackMainList",
					detailEditCommand: "onEditCase",
					detailLinkPatchCommand: "onPatchLinkCase"
				},
				configurationView: {
					saveSettingsCommand:	"onSaveSettings",
					purgeSettingsCommand: "onPurgeSettings",
					backSettingsCommand: "onBackSettings"
				},
				searchForm: {
					searchCaseCommand: 'onSearchCase'
				},
				itsmOverview: {
					initImageCommand: "onInitImages"
				},
				itsmEditForm: {
					saveCaseCommand: "onEditSave",
					backCaseEditCommand: "onCaseDetailBack"
				},
				itsmPatchAssignForm: {
					linkCaseCommand: "onLinkSave",
					backCaseLinkCommand: "onCaseDetailBack"
				},
				patchMgmtView: {
					backCommand: "onBackMainList",
					insertPatchCommand: "onNewPatch",
					updatePatchCommand: "onUpdatePatch"
				}
		}
	},

	onBackMainList: function() {
// <<<
		console.log("controller.itsm.onBackCommand");
		opentext.data.activeCase = {};
		this.activateMainView();
	},
// >>>

	onEditCase: function(data) {
// <<<
		console.log("controller.itsm.onEditCase: requesting Edit From for case: " + data.case );
		Ext.Viewport.animateActiveItem(this.getItsmEditForm(), this.slideLeftTransition);
	},
// >>>

	onPatchLinkCase: function(caseNo) {
// <<<
		var settings = Ext.getStore("settings");
		var s = Ext.getStore('patches');
		var rec, data, hostName;

		console.log("controller.itsm.onPatchLinkCase: requesting Patch Assign for case: " + caseNo.id + '<, >' + caseNo.case + '<' );

		try {
			rec = settings.getAt(0);
			data = rec.get('settingsContainer');
			hostName = data[0];

			s.getProxy().setUrl( hostName + '?cmd=patches&data=open' );
			console.log('Request >' + s.getProxy().getUrl() + '<' );
			s.load();

			Ext.Viewport.animateActiveItem(this.getItsmPatchAssignForm(), this.slideLeftTransition);
		}
		catch(e) {
			Ext.Msg.alert( e.name );
		}
	},
// >>>

	onSearchBack: function() {
// <<<
		console.log("controller.itsm.onSearchBackCommand");
		this.activateMainView();
	},
// >>>

	onITSMDetail: function(obj, record) {
// <<<
		console.log("controller.itsm.onITSMDetail");
		console.log( record );
		this.activateITSMDetail(record);
	},
// >>>

	activateMainView: function () {
// <<<
		Ext.Viewport.animateActiveItem(this.getMainListContainer(), this.slideRightTransition);
	},
// >>>

	onSettings: function() {
// <<<
		Ext.Viewport.animateActiveItem(this.getConfigurationView(), this.slideLeftTransition);
	},
// >>>

	onPatchMgmt: function() {
// <<<
		var settings = Ext.getStore("settings");
		var s = Ext.getStore('patches');
		var rec, data, hostName;

		console.log('controller.itsm.onPatchMgmt: requesting Patch Management View' );

		try {
			rec = settings.getAt(0);
			data = rec.get('settingsContainer');
			hostName = data[0];

			s.getProxy().setUrl( hostName + '?cmd=patches&data=all' );
			console.log('Request >' + s.getProxy().getUrl() + '<' );
			s.load();

			Ext.Viewport.animateActiveItem(this.getPatchMgmtView(), this.slideLeftTransition);
		}
		catch(e) {
			Ext.Msg.alert( e.name );
		}
	},
// >>>

	onSearch: function() {
// <<<
		Ext.Viewport.animateActiveItem(this.getSearchForm(), this.slideLeftTransition);
	},
// >>>

	activateITSMDetail: function (record) 
	{ // <<<
		console.log("controller.itsm.activateITSMDetail");

		var rec;
		var data = [];
		var settings = Ext.getStore("settings");
		var s = Ext.getStore('desktopITSM');
		var v;

		try {
			rec = settings.getAt(0);
			data = rec.get('settingsContainer');
			var hostName = data[0];
			console.log( 'controller: URL=' + s.getProxy().getUrl() );
//			var hostName = settings.getData().items[0].data.hostName;
			/* New command structure */
			s.getProxy().setUrl( hostName + '?cmd=send&data=' + record );
			console.log( 'controller: URL=' + s.getProxy().getUrl() );

//			s.getProxy().setUrl( hostName + '?otcs=' + record );
//			console.log( 'controller: URL=' + s.getProxy().getUrl() );
			s.load();

			v = this.getItsmDetail();
			for ( var i in v.getItems().keys) {
				if( v.getItems().keys[i].search('detailPanel') !== -1 ) {
					v.getItems().items[i].setTitle('OTCS Cases');
				}
			}
			Ext.Viewport.animateActiveItem(v, this.slideLeftTransition);

//			Ext.Viewport.animateActiveItem(this.getItsmDetail(), this.slideLeftTransition);
		}
		catch(e) {
			Ext.Msg.alert( e.name );
		}
	},
	// >>>


	onInitImages: function(obj, opts) 
/* This method is a poor man initiative to injets the Images
 * that have the right dimentions. The IMG tah is dynamicaly 
 * injected after the rendering the carousel container and 
 * getting the available size. That is all obsoleted by using
 * the tag IMG directly with the tag width=100%. 
 */
	{ // <<<
		var iterator;
		var imageSources = ['resources/images/otcs-6m.png','resources/images/otcs-1y.png','resources/images/otcs-5y.png'];
		var imageContainers = ['otcs-image-container-6m','otcs-image-container-1y','otcs-image-container-5y'];
		var imageIds = ['image-6m','image-1y','image-5y'];

		for (var iterator=0; iterator<3; iterator++) {
			if( window.document.getElementById( imageIds[iterator] ) !== null ) continue;
			var i = new Image();
			console.log('Index: ' + iterator + ' Container ID: ' + imageContainers[iterator] + ' ImagePath: ' + imageSources[iterator] );
			i.setAttribute('src', imageSources[iterator] );
			i.setAttribute('id',  imageIds[iterator] );
			var c = document.getElementById( imageContainers[iterator] );
			var cont;
			try {
				cont = c.getAttribute('id');
				console.log('Using ' + cont + ' object' );
				var iw = c.getClientRects()[0].width; 
				console.log('Reqiured width for image: ' + iw );
				i.setAttribute( 'width', iw + 'px' );
//				c.removeChild(document.getElementById('img001_mame'));
				c.appendChild(i);
			} 
			catch(e) {
				console.warn('trying to access a non-existing element!');
			}

		}
		console.log("view.itsm.controller initImage leaving");
	},	
	// >>>

	onChartSwap: function(obj)
	{ // <<<
		var what = obj;
		var mainView = this.getMainListContainer();

		if( opentext.data.carouselVisibility !== "show" ) {
			mainView.getLayout().setItemFlex(mainView.getItems().items[1], "2.7");
			mainView.getLayout().setItemFlex(mainView.getItems().items[2], "2.3");
			opentext.data.carouselVisibility = "show";
		} else {
			mainView.getLayout().setItemFlex(mainView.getItems().items[2], "0.001");
			opentext.data.carouselVisibility = "hide";
		}

		console.log('controller.itsm.onChartSwap: chart visibility swapped.' );

		Ext.Viewport.animateActiveItem(mainView, this.slideRightTransition);
	}, // >>>

	onSaveSettings: function(hostName) 
	{ // <<<
		var rec;
		var data = [];
		var settings = Ext.getStore("settings");
		var s = Ext.getStore("itsm");

		console.log('controller.itsm.saveSettings:' + hostName );

		try {
			rec = settings.getAt(0);
			data = rec.get('settingsContainer');
			data[0] = hostName;
			rec.set('settingsContainer', data );
		}
		catch(e) {
			settings.add({'settingsContainer': [hostName] } );
		}
		settings.sync();

		s.getProxy().setUrl( hostName + '?cmd=describe&data=Descriptor' );
		console.log( 'controller: URL=' + s.getProxy().getUrl() );

//		s.getProxy().setUrl( hostName + '?otcs=Descriptor' );
//		console.log( 'controller: setting Descriptors URL=' + s.getProxy().getUrl() );
		s.load();

		this.activateMainView();
	},
	// >>>

	onSearchCase: function(caseNo) 
	{ // <<<
		var rec,hostName;
		var data = [];
		var settings = Ext.getStore("settings");
		var s = Ext.getStore('desktopITSM');
		var v;

		console.log('controller search for case No.>' + caseNo + '<' );

		try {
			rec = settings.getAt(0);
			data = rec.get('settingsContainer');
			hostName = data[0];

			s.getProxy().setUrl( hostName + '?cmd=search&data=' + caseNo );
			console.log('Request >' + s.getProxy().getUrl() + '<' );

			s.load();

			v = this.getItsmDetail();
			for ( var i in v.getItems().keys) {
				if( v.getItems().keys[i].search('detailPanel') !== -1 ) {
					v.getItems().items[i].setTitle('Search Result');
				}
			}
			Ext.Viewport.animateActiveItem(v, this.slideLeftTransition);
//			Ext.Viewport.animateActiveItem(this.getItsmDetail(), this.slideLeftTransition);
		}
		catch(e) {
			console.error( e.message );
		}
	},
	// >>>

	onEditSave: function(caseNo, caseTxt) 
	{ // <<<
		var rec,hostName;
		var data = [];
		var settings = Ext.getStore("settings");
		var db = Ext.getStore('db');
		var s = Ext.getStore('desktopITSM');
		var v;

		try {
			console.log('controller search for case No.>' + caseNo.id + '<>' + caseNo.case + '<' );
			rec = settings.getAt(0);
			data = rec.get('settingsContainer');
			var hostName = data[0];

			db.getProxy().setUrl( hostName + '?cmd=save&data={"caseId": "' + caseNo.id + '", "caseNo": "' + caseNo.case + '","caseTxt":"' + caseTxt + '"}' );
			console.log('Request >' + db.getProxy().getUrl() + '<' );
			db.load();

			// The data can be reloaded after updating them
			// in database. Th sideefect is that the nestedlist and 
			// data source gets out of syns and various efect can occur
			// Preferably do not refresh the data store ...
//			s.load();

			Ext.Viewport.animateActiveItem(this.getItsmDetail(), this.slideLeftTransition);
//			this.activateMainView();
		}
		catch(e) {
			console.error( e.message );
		}
	},
	// >>>

	onLinkSave: function(caseData, obj) 
	{ // <<<
		var rec,hostName;
		var data = [];
		var settings = Ext.getStore("settings");
		var s = Ext.getStore('db');
		var it = Ext.getStore('desktopITSM');
		var v;

		console.log('controller link case >' + caseData.case + '<>' + caseData.id + '< with Patch Id >' + obj.patch + '< Unlink >' + obj.drop + '<' );

		try {
			rec = settings.getAt(0);
			data = rec.get('settingsContainer');
			hostName = data[0];

			s.getProxy().setUrl( hostName + '?cmd=link&data={"caseId": "' + caseData.id + '", "caseNo": "' + caseData.case + '","patchId":"' + obj.patch + '","drop":"' + obj.drop + '"}' );
			console.log('Request >' + s.getProxy().getUrl() + '<' );
			s.load();

			// The data can be reloaded after updating them
			// in database. Th sideefect is that the nestedlist and 
			// data source gets out of syns and various efect can occur
			// Preferably do not refresh the data store ...
//			it.load();

			Ext.Viewport.animateActiveItem(this.getItsmDetail(), this.slideLeftTransition);
		}
		catch(e) {
			console.error( e.message );
		}
	},
	// >>>

	onPurgeSettings: function() 
	{ // <<<
		console.log('controller: purging Configuration');
		try {
			localStorage.removeItem('new-otcs-monitor-settings');
//			localStorage.clear();
		}
		catch(e) {
			Ext.Msg.alert(e.name + "Error purging settings" );
		}
	},
	// >>>

	onBackSettings: function() {
// <<<
		console.log('controller: back from Configuration');
		this.activateMainView();
	},
// >>>

	onCaseDetailBack: function() {
// <<<
		console.log('controller: back from Case Details Form (update,patch)');
		Ext.Viewport.animateActiveItem(this.getItsmDetail(), this.slideLeftTransition);
	},
// >>>

	onNewPatch: function(obj) {
// <<<
		var rec,hostName;
		var data = [];
		var settings = Ext.getStore("settings");
		var db = Ext.getStore('db');
		var v;

		try {
			console.log('controller creating new patch >' + obj.patchName + '<' );
			rec = settings.getAt(0);
			data = rec.get('settingsContainer');
			var hostName = data[0];

			db.getProxy().setUrl( hostName + '?cmd=create_patch&data={"patchName": "' + obj.patchName + '"}' );
			console.log('Request >' + db.getProxy().getUrl() + '<' );
			db.load();

			this.activateMainView();
		}
		catch(e) {
			console.error( e.message );
		}
	},
// >>>

	onUpdatePatch: function(obj) {
// <<<
		var rec,hostName;
		var data = [];
		var settings = Ext.getStore("settings");
		var db = Ext.getStore('db');
		var s = Ext.getStore('desktopITSM');
		var v;

		try {
			console.log('controller updating patch >' + obj.patchId + '<' );
			console.log('controller updating patch >' + obj.patchETA + '<' );
			console.log('controller updating patch >' + obj.patchStatus + '<' );
			rec = settings.getAt(0);
			data = rec.get('settingsContainer');
			var hostName = data[0];

			db.getProxy().setUrl( hostName + '?cmd=update_patch&data={"patchId": "' + obj.patchId + '","patchETA":"' + obj.patchETA + '","patchStatus":"' + obj.patchStatus + '"}' );
//			db.getProxy().setUrl( hostName + '?cmd=update_patch&data={"patchId": "' + obj.patchId + '","patchETA":"2013-03-21","patchStatus":"' + obj.patchStatus + '"}' );
			console.log('Request >' + db.getProxy().getUrl() + '<' );
			db.load();

//			this.activateMainView();
		}
		catch(e) {
			console.error( e.message );
		}
	},
// >>>

	// Base Class functions.
	launch: function () {
		this.callParent(arguments);
		console.log("controller.itsm.launch");
	},

	init: function () {
		this.callParent(arguments);
		console.log("controller.itsm.init");
	 }
});

