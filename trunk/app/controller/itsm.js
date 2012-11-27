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
				itsmOverview: "itsmoverview"
		},
		control: {
				mainListContainer: {
					// The commands fired by the notes list container.
					itsmDetailCommand: "onITSMDetail",
					settingsCommand: "onSettings",
					searchCommand: "onSearch",
					initImageCommand: "onInitImages"
				},
				itsmDetail: {
					detailBackCommand: "onBackMainList"
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
				}
		}
	},

	onBackMainList: function() {
		console.log("controller.itsm.onBackCommand");
		this.activateMainView();
	},

	onSearchBack: function() {
		console.log("controller.itsm.onSearchBackCommand");
		this.activateMainView();
	},

	onITSMDetail: function(obj, record) {
		console.log("controller.itsm.onITSMDetail");
		console.log( record );
		this.activateITSMDetail(record);
	},

	activateMainView: function () {
		Ext.Viewport.animateActiveItem(this.getMainListContainer(), this.slideRightTransition);
	},

	onSettings: function() {
		Ext.Viewport.animateActiveItem(this.getConfigurationView(), this.slideLeftTransition);
	},

	onSearch: function() {
		Ext.Viewport.animateActiveItem(this.getSearchForm(), this.slideLeftTransition);
	},

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
//			s.getProxy().setUrl('http://localhost:18080/jsfks/sencha?otcs=' + record + '&data02=wolle_lehni' );
//			var hostName = settings.getData().items[0].data.hostName;
			s.getProxy().setUrl( hostName + '?otcs=' + record );
			console.log( 'controller: URL=' + s.getProxy().getUrl() );
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
//		debugger;
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

		s.getProxy().setUrl( hostName + '?otcs=Descriptor' );
		console.log( 'controller: setting Descriptors URL=' + s.getProxy().getUrl() );
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
			s.getProxy().setUrl( hostName + '?search=' + caseNo );
			console.log('controller setting search request >' + s.getProxy().getUrl() + '<' );
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
		console.log('controller: back from Configuration');
		this.activateMainView();
	},

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

