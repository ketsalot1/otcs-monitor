Ext.define("itsm.view.patchMainView", {
	extend: "Ext.Container",
	alias: 'widget.patchmainview',
	config: {
		layout: {
//			type: 'fit'
			type: 'vbox'
		}
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		console.log("view.patchMainView.initialize event fired");

		var backButton = {
			xtype: "button",
			ui: "back",
			text: "Home",
			listeners: {
				tap: { fn: this.onBackButtonTap, scope: this }
			}
		};

		var saveButton = {
			xtype: "button",
			ui: "action",
			text: "Save",
			listeners: {
				tap: { fn: this.onSaveButtonTap, scope: this }
			}
		};

		var topToolbar = {
			xtype: "toolbar",
			title: 'Manage',
			docked: "top",
			items: [
				backButton,
				{ xtype: "spacer" },
				saveButton
			]
		};

		var patchCarousel = {
//			xtype: "patchmgmtview",
//			flex: "1.0",
//			listeners: {
//				activeitemchange: { fn: this.onCarouseItemChange, scope: this }
//			},

			flex: "5.0", // Hide initially
			xtype: 'carousel',
			defaults: {
				styleHtmlContent: true
			},
			listeners: {
				activeitemchange: { fn: this.onCarouselItemChange, scope: this }
			},
			items: [
				{
					xtype: 'patchmgmtupdateform'
				},
				{
					xtype: 'patchmgmtinsertform'
				},
				{
					xtype: 'projectmgmtinsertform'
				}
			]
		};

		this.add([topToolbar,patchCarousel]);

		console.log("view.patchMainView.initialize event leaving");
   },
// >>>

	onCarouselItemChange: function() {
		console.log("patchView.carousel.itemChange event fired. Active page index = " + this.getItems().items[1].activeIndex);
	},

	onBackButtonTap: function() {
		console.log("patchView.carousel.back event fired");
		this.fireEvent("backCommand", this);
	},

	onSaveButtonTap: function() {
		var obj = {};
		console.log("patchView.save event fired. Active page index = " + this.getItems().items[1].activeIndex);
		// The firm page is the update form ...
		debugger;
		/* Find a specific form and its fields is done by:
		 * Ext.ComponentQuery.query('patchmgmtupdateform')[0].getFields()
		 */
		if( this.getItems().items[1].activeIndex == 0 ) {
			obj.patchId = this.getItems().items[1].getItems().items[1].getFields().patch.getValue()
			obj.patchETA = this.getItems().items[1].getItems().items[1].getFields().eta.getFormattedValue();
			if( this.getItems().items[1].getItems().items[1].getFields().released.getValue() == 1 )
				obj.patchStatus = "open";
			else
				obj.patchStatus = "developed";
			this.fireEvent("updatePatchCommand", obj);
		}
		// The second page is the new patch form
		if( this.getItems().items[1].activeIndex == 1 ) {
			obj.patchName = this.getItems().items[1].getItems().items[2].getFields().patch.getValue()
			this.fireEvent("insertPatchCommand", obj);
		}

		if( this.getItems().items[1].activeIndex == 2 ) {
			debugger;
			obj.name = this.getItems().items[1].getItems().items[3].getFields().name.getValue()
			obj.description = this.getItems().items[1].getItems().items[3].getFields().description.getValue()
			this.fireEvent("insertProjectCommand", obj);
		}
	}
});
