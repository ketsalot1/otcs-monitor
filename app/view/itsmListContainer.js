Ext.define("itsm.view.itsmListContainer", {
	extend: "Ext.Container",
	xtype: 'itsmlistcontainer',
	alias: "widget.itsmlistcontainer",
	config: {
		layout: {
//			type: 'fit'
			type: 'hbox'
		},
	},

	initialize: function() { // <<<
		this.callParent(arguments);

		console.log("view.listpanelcontainer.initialize event fired" );

		var leftPanel = {
			xtype: "itsmlist",
			flex: "0.5",
			store: Ext.getStore('activities'),
			listeners: {
				disclose: { fn: this.onDisclose, scope: this }
			}
		};

		var rightPanelList = {
			xtype: "itsmlist",
			store: Ext.getStore('dashboard'),
			flex: "2.1",
			listeners: {
				disclose: { fn: this.onDisclose, scope: this }
			}
		};

		var rightPanelOverview = {
			xtype: 'itsmoverview',
			flex: "0.9"
		};

		var rightPanel = {
			xtype: "panel",
			flex: "0.5",
			border: "8 px solid red",
			layout: {
				type: 'vbox'
			},	
			items: [
				rightPanelList,
				rightPanelOverview
			]

		};

		this.add([leftPanel,rightPanel]);
	},
  	// >>>

	onDisclose: function (list, record, target, index, evt, options) {
		console.log("view.itsmListContainer.disclose");
		/* Create custom event handler in ther parent, that fires the 
		 * global event for the controller
		 */
		this.getParent().fireEvent( 'panelRequest', record.data.code );
	}

});
