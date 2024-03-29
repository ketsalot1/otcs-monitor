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

		var chartButton = {
			xtype: "button",
			ui: "action",
			iconCls: 'chart2',
			iconMask: true,
			listeners: {
				tap: { fn: this.onChartButtonTap, scope: this }
			}
		};

		var searchButton = {
			xtype: "button",
			ui: "action",
//			text: "Search",
//			iconCls: 'chart2',
			iconCls: 'search',
			iconMask: true,
			listeners: {
				tap: { fn: this.onSearchButtonTap, scope: this }
			}
		};

		var patchMgmtButton = {
			xtype: "button",
			ui: "action",
//			text: "Settings",
//			iconCls: 'equalizer1',
//			iconCls: 'settings_black',
			iconCls: 'doc_drawer',
			iconMask: true,
			listeners: {
				tap: { fn: this.onPatchMgmtButtonTap, scope: this }
			}
		};

		var settingsButton = {
			xtype: "button",
			ui: "action",
//			text: "Settings",
//			iconCls: 'equalizer1',
//			iconCls: 'settings_black',
			iconCls: 'settings',
			iconMask: true,
			listeners: {
				tap: { fn: this.onSettingsButtonTap, scope: this }
			}
		};

		var topToolbar = {
			xtype: "toolbar",
//			title: 'OTCS Monitor',
			title: 'OTCS',
			docked: "top",
			items: [
				chartButton,
				searchButton,
				{ xtype: "spacer" },
				patchMgmtButton,
				settingsButton
			]
		};

		var itsmList = {
			xtype: "itsmlist",
//			flex: "2.7",
			flex: "1",
			store: Ext.getStore("itsm"),
			listeners: {
				disclose: { fn: this.onNotesListDisclose, scope: this }
			}
		};

		var itsmOverview = {
			xtype: 'itsmoverview',
//			height: 0, // hide this iniatially
			flex: "0",
			listeners: {
				activeitemchange: { fn: this.onCarouseItemChange, scope: this }
			},

//			flex: "2.3" // Hide initially
/* <<<  
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
				},
				{
//					html: "<img src='resources/images/otcs-5y.png' width='284px'/>"
					xtype: 'aboutscreen',
					store: Ext.getStore("aboutInfo"),
					style: 'background-color: #5AB5F5; border: 4px; border-radius: 12px; border-shadow: 7px 7px 7px blue;'
				}
			],
>>> */
		};

		opentext.data.carousel = itsmOverview;
		/* Right after the main view is initialized, get the data for the 
		 * the application. Use sequenced call, as the server side cannot 
		 * handle paralell requests yet!
		 */

		var settings = Ext.getStore('settings');
		var rec = settings.getAt(0);
		var data = [];
		try {
			data = rec.get('settingsContainer');
			var hostName = data[0];

			var s = Ext.getStore("itsm");

			/* new command structure */
			s.getProxy().setUrl( hostName + '?cmd=describe_ex&data=Descriptor' );
			console.log( 'controller: URL=' + s.getProxy().getUrl() );
			s.load( function( record, operation, success ) {
				console.log("descriptor loaded, requesting statistics ... " );
				// First after on DB calls returns, trigger "initialize the Statistics" ...
				var o = Ext.getStore('itsmOverview');
				o.getProxy().setUrl( hostName + '?cmd=get_overview&data={"n":"n"}' );
				console.log( 'controller: URL=' + s.getProxy().getUrl() );
				o.load(function( record, operation, success ) {
					console.log("Statistic loaded");
				}, this );
			}, this );
		} 
		catch(e) {
			console.error('Configuration purged or not saved yet')
			Ext.Msg.alert("Configure the application first");
		}

		this.add([topToolbar,itsmList,itsmOverview]);
//		this.add([itsmList,itsmOverview,topToolbar]);

		console.log("view.mainListContainer.initialize event leaving");
   },
// >>>

	initImages: function(obj,opts) {
		console.log("view.mainListContainer.painted event fired");
		this.fireEvent('initImageCommand', obj, opts);
	},	

	onCarouseItemChange: function( obj, opts ) {
		console.log("view.carousel.itemChange event fired");
		this.fireEvent('initImageCommand', obj, opts);
	},

	onNotesListDisclose: function (list, record, target, index, evt, options) {
		console.log("view.mainListContainer.disclose");
		this.fireEvent('itsmDetailCommand', this, record.data.code);
	},

	onChartButtonTap: function () {
		console.log("view.mainListContainer.ChartButtonTap");
		this.fireEvent('swapChartCommand', this );
	},

	onSearchButtonTap: function () {
		console.log("view.mainListContainer.SearchButtonTap");
		this.fireEvent('searchCommand', this );
	},

	onSettingsButtonTap: function () {
		console.log("view.mainListContainer.SettingsButtonTap");
		this.fireEvent('settingsCommand', this );
	},

	onPatchMgmtButtonTap: function() {
		console.log("view.mainListContainer.PatchMgmtButtonTap");
		this.fireEvent('patchMgmtCommand', this );
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

