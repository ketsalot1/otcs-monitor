var opentext = {};
opentext.data = {};

Ext.define("itsm.view.MainListContainer", {
	extend: "Ext.Container",
	xtype: 'mainlistcontainer',
	alias: "widget.mainlistcontainer",
	config: {
		layout: {
//			type: 'fit'
			type: 'vbox'
		},
		listeners: {
			painted: 'initImages'
		}
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		console.log("view.mainListContainer.initialize event fired");

		var searchButton = {
			xtype: "button",
			ui: "action",
//			text: "Search",
			iconCls: 'search',
			iconMask: true,
			listeners: {
				tap: { fn: this.onSearchButtonTap, scope: this }
			}
		};

		var settingsButton = {
			xtype: "button",
			ui: "action",
//			text: "Settings",
			iconCls: 'settings',
			iconMask: true,
			listeners: {
				tap: { fn: this.onSettingsButtonTap, scope: this }
			}
		};

		var topToolbar = {
			xtype: "toolbar",
			title: 'OTCS Monitor',
			docked: "top",
			items: [
				searchButton,
				{ xtype: "spacer" },
				settingsButton
			]
		};

		var itsmList = {
			xtype: "itsmlist",
			flex: "2.7",
			store: Ext.getStore("itsm"),
			listeners: {
				disclose: { fn: this.onNotesListDisclose, scope: this }
			}
		};

		var itsmOverview = {
//			xtype: 'itsmoverview',
/* <<< */
			xtype: 'carousel',
			defaults: {
				styleHtmlContent: true
			},
			listeners: {
				activeitemchange: { fn: this.onCarouseItemChange, scope: this }
			},
			items: [
				{
//					html: "<img src='resources/images/otcs-6m.png' width='284px'/>"
					html: "<div id='otcs-image-container-6m'></div>"
				},
				{
//					html: "<img src='resources/images/otcs-1y.png' width='284px'/>"
					html: "<div id='otcs-image-container-1y'></div>"
				},
				{
//					html: "<img src='resources/images/otcs-5y.png' width='284px'/>"
					html: "<div id='otcs-image-container-5y'></div>"
				}
			],
/* >>> */
			flex: "2.3"
		};

		opentext.data.carousel = itsmOverview;

		var settings = Ext.getStore('settings');
		var rec = settings.getAt(0);
		var data = [];
		try {
			data = rec.get('settingsContainer');
			var hostName = data[0];

			var s = Ext.getStore("itsm");
			s.getProxy().setUrl( hostName + '?otcs=Descriptor' );
			console.log( 'controller: setting Descriptors URL=' + s.getProxy().getUrl() );
			s.load();
		} 
		catch(e) {
			console.error('Configuration purged or not saved yet')
			Ext.Msg.alert("Configure the application first");
		}

		this.add([topToolbar,itsmList,itsmOverview]);

		/*
		setTimeout( function() {
			var i = new Image();
			i.setAttribute('src', 'resources/images/otcs-6m.png');
			i.setAttribute('id', 'image-6m' );
			var c = document.getElementById('otcs-image-container-6m');
			var cont = c.getAttribute('id');
			console.log('Using ' + cont + ' object' );
			var iw = c.getClientRects()[0].width 
			console.log('Reqiured width for image: ' + iw );
			i.setAttribute( 'width', iw + 'px' );
//			c.removeChild(document.getElementById('img001_mame'));
			c.appendChild(i);
		}, 10000 );
		*/

		console.log("view.mainListContainer.initialize event leaving");
   },

	initImages: function(obj,opts) {
		console.log("view.mainListContainer.painted event fired");
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
		console.log("view.mainListContainer.painted event leaving");
	},	

	onCarouseItemChange: function() {
		console.log("view.mainListContainer.carousel.itemChange event fired");
		this.initImages();
	},

	onNotesListDisclose: function (list, record, target, index, evt, options) {
		console.log("view.mainListContainer.disclose");
		this.fireEvent('itsmDetailCommand', this, record.data.code);
	},

	onSearchButtonTap: function () {
		console.log("view.mainListContainer.SearchButtonTap");
		this.fireEvent('searchCommand', this );
	},

	onSettingsButtonTap: function () {
		console.log("view.mainListContainer.SettingsButtonTap");
		this.fireEvent('settingsCommand', this );
	}

/* <<<

	onDeleteButtonTap: function (list, record, target, index, evt, options) {
		console.log("view.NotesListContainer_1.DeleteNoteTap");
		Ext.Msg.confirm( "Delete", "Delete selected note?", function(button) {
			if( button == "yes" ) {
				this.fireEvent('deleteNoteCommand', this);
			}
		}, this );
	},

	deleteConfirm: function(button) {
		Ext.Msg.alert(button.id);
	},

	onAboutButtonTap: function () {
		console.log("view.NotesListContainer_1.AboutButtonTap");
		this.fireEvent('aboutCommand', this );
	}
 >>> */
});

