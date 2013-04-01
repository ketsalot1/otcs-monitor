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

		var archiveButton = {
			xtype: "button",
			ui: "action",
			text: "Archive",
			id: "patch_mgmt_archive",
			listeners: {
				tap: { fn: this.onArchiveButtonTap, scope: this }
			}
		};

		var saveButton = {
			xtype: "button",
			ui: "action",
			text: "Save",
			id: "patch_mgmt_save",
			listeners: {
				tap: { fn: this.onSaveButtonTap, scope: this }
			}
		};

		var topToolbar = {
			xtype: "toolbar",
//			title: 'Manage',
			docked: "bottom",
			items: [
				backButton,
				{ xtype: "spacer" },
				archiveButton,
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

/*
		Ext.Array.forEach(Ext.ComponentQuery.query('button'), function (button) {
			if (button.getId() === 'patch_mgmt_archive') {
				button.show();
			}
		});
*/
		console.log("view.patchMainView.initialize event leaving");
   },
// >>>

	onCarouselItemChange: function() {
		var index = this.getItems().items[1].activeIndex;
		console.log("patchView.carousel.itemChange event fired. Active page index = " + index);
		Ext.Array.forEach(Ext.ComponentQuery.query('button'), function (button) {
			if (button.getId() === 'patch_mgmt_save') {
				console.log( 'patch management panel: save button found!' );
				button.setBadgeText("");
			}
			if (button.getId() === 'patch_mgmt_archive') {
				console.log( 'patch management panel: archive button found!' );
				if( index == 0 )
					button.show();
				else {
					button.hide();
					button.setBadgeText("");
				}
			}
		});
	},

	onBackButtonTap: function() {
		console.log("patchView.carousel.back event fired");
		Ext.Array.forEach(Ext.ComponentQuery.query('button'), function (button) {
			if (button.getId() === 'patch_mgmt_save') {
				console.log( 'patch management panel: save button found!' );
				button.setBadgeText("");
			}
		});
		this.fireEvent("backCommand", this);
	},

	onSaveButtonTap: function() {
		var obj = {};
		console.log("patchView.save event fired. Active page index = " + this.getItems().items[1].activeIndex);
		try {
			if( this.getItems().items[1].activeIndex == 0 ) {
				var form = Ext.ComponentQuery.query('patchmgmtupdateform')[0];
				if( typeof form == "undefined" ) 
					throw({name:"Form Problem", message:"Cannot find requested form"});
				var src = this.getItems().items[1].getItems().items[1];
				if( form.getId() != src.getId() ) 
					throw({name:"Form Problem", message:"Cannot find requested form"});
				obj.patchId = src.getFields().patch.getValue();
				obj.patchETA = src.getFields().eta.getFormattedValue();
				debugger;
				if( src.getFields().released.getValue() == 1 )
					obj.patchStatus = "open";
				else
					obj.patchStatus = "developed";
				this.fireEvent("updatePatchCommand", obj);
			}
			// The second page is the new patch form
			if( this.getItems().items[1].activeIndex == 1 ) {
				var form = Ext.ComponentQuery.query('patchmgmtinsertform')[0];
				if( typeof form == "undefined" ) 
					throw({name:"Form Problem", message:"Cannot find requested form"});
				var src = this.getItems().items[1].getItems().items[2];
				if( form.getId() != src.getId() ) 
					throw({name:"Form Problem", message:"Cannot find requested form"});
				obj.patchName = src.getFields().patch.getValue();
				this.fireEvent("insertPatchCommand", obj);
			}

			if( this.getItems().items[1].activeIndex == 2 ) {
				var form = Ext.ComponentQuery.query('projectmgmtinsertform')[0];
				if( typeof form == "undefined" ) 
					throw({name:"Form Problem", message:"Cannot find requested form"});
				var src = this.getItems().items[1].getItems().items[3];
				if( form.getId() != src.getId() ) 
					throw({name:"Form Problem", message:"Cannot find requested form"});
				obj.name = src.getFields().name.getValue();
				obj.description = src.getFields().description.getValue();
				this.fireEvent("insertProjectCommand", obj);
			}
		}
		catch(e) {
			Ext.Msg.alert("Form", "Cannot access form data" );
			console.error(e.name + ": " + e.message);
		}
	},

	onArchiveButtonTap: function() {
		var lm = {};
		console.log("view.itsmDetail.setArchived");

		function onReply(btn) {
			if( btn == "yes" ) {
				this.fireEvent("archivePatchCommand");
			} else {
				console.log("view.patchMainView.archivePatch - operation canceled");
			}
		}

		Ext.Msg.confirm("Confirmation", "Archive patches?", onReply, this );
	},
});
