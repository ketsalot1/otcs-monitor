Ext.define("itsm.view.MainListContainer", {
	extend: "Ext.Container",
	xtype: 'mainlistcontainer',
	alias: "widget.mainlistcontainer",
	config: {
		itemId: 'mainListContainerID',
		layout: {
//			type: 'fit'
			type: 'vbox'
		},
		listeners: {
			painted: 'initImages',
			/* custom even for child panels. This even just bubbles the even to controller */
			panelRequest: function( data ) {
				console.log( "MainListContainer: custom event handler: panelRequest " );
				this.fireEvent('itsmDetailCommand', this, data );
			}
		}
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		console.log("view.mainListContainer.initialize event fired");

/*
		var chartButton = {
			xtype: "button",
			ui: "action",
			iconCls: 'chart2',
			iconMask: true,
			listeners: {
				tap: { fn: this.onChartButtonTap, scope: this }
			}
		};
*/

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
//				chartButton,
				searchButton,
				{ xtype: "spacer" },
				patchMgmtButton,
				settingsButton
			]
		};

		var itsmList = {
			xtype: "itsmlistcontainer",
//			flex: "2.7",
			flex: "1",
//			store: Ext.getStore("itsm"),
//			listeners: {
//				disclose: { fn: this.onNotesListDisclose, scope: this }
//			}
		};

/*
		var itsmOverview = {
			xtype: 'itsmoverview',
			flex: "0",
			listeners: {
				activeitemchange: { fn: this.onCarouseItemChange, scope: this }
			},
*/

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
//		};

		//opentext.data.carousel = itsmOverview;
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

			var s = Ext.getStore("dashboard");

			/* new command structure */
			s.getProxy().setUrl( hostName + '?cmd=describe_ex&data={"context":"dashboard"}' );
			console.log( 'controller: URL=' + s.getProxy().getUrl() );
			s.load( function( record, operation, success ) {
				console.log("Dashboard descriptor loaded, requesting statistics ... " );
				// First after on DB calls returns, trigger "initialize the Statistics" ...
				var o = Ext.getStore('itsmOverview');
				o.getProxy().setUrl( hostName + '?cmd=get_overview&data={"n":"n"}' );
				console.log( 'controller: URL=' + o.getProxy().getUrl() );
				o.load(function( record, operation, success ) {
					console.log("Statistic loaded, requesting activities ... ");
					
					var z, c, misc;
					var temp = o.getAt(0).get('case_total');
					var htmlCode;

					var cont = window.document.getElementById( 'itsm-statistics-container' );
					htmlCode = "<p><div style=\"font-width: bold; font-size: 1.2em\">Support Case Statistics</div>Total cases monitored: " + temp + "<br/>";
					z = o.getAt(0).get('case_opened_week_count');
					c = o.getAt(0).get('case_closed_week_count');
					temp = z - c;
					misc = o.getAt(0).get('case_closed_week_avg');
					htmlCode += ("Cases week-to-week: " + temp + " (" + z + "/" + c + ")<br/>");
					htmlCode += ("<div style=\"font-width= normal; font-size: 0.8em\">&nbsp;&nbsp;average closing age: " + misc + " days</div>");
					z = o.getAt(0).get('case_opened_month_count');
					c = o.getAt(0).get('case_closed_month_count');
					temp = z - c;
					misc = o.getAt(0).get('case_closed_month_avg');
					htmlCode += ("Cases month-to-month: " + temp + " (" + z + "/" + c + ")<br/>");
					htmlCode += ("<div style=\"font-width= normal; font-size: 0.8em\">&nbsp;&nbsp;average closing age: " + misc + " days</div>");
					temp = o.getAt(0).get('patches_total');
					htmlCode += ("Patches in production: " + temp + "<br/>");
		
					htmlCode += "</p>";
					cont.innerHTML = htmlCode;

					var activities = Ext.getStore('activities');
					activities.getProxy().setUrl( hostName + '?cmd=describe_ex&data={"context":"activities"}' );
					console.log( 'controller: URL=' + activities.getProxy().getUrl() );
					activities.load(function( record, operation, success ) {
						console.log("Activities loaded.");
						Ext.repaint();
						console.log("Ext.repaint fired!");
					}, this );
				}, this );
			}, this );
		} 
		catch(e) {
			console.error('Configuration purged or not saved yet')
			Ext.Msg.alert("Configure the application first");
		}

		this.add([topToolbar,itsmList]);
//		this.add([topToolbar,itsmList,itsmOverview]);
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

/*
	onChartButtonTap: function () {
		console.log("view.mainListContainer.ChartButtonTap");
		this.fireEvent('swapChartCommand', this );
	},
*/	

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

