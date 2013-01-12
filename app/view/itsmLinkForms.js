Ext.define("itsm.view.itsmLinkForms", {
	extend: "Ext.Container",
	alias: "widget.itsmlinkformcont",
	config: {
		layout: {
//			type: 'fit'
			type: 'vbox'
		}
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var backButton = {
			xtype: 'button',
			text: 'Back',
			ui: 'back',
//			ui: 'action',
//			iconCls: 'delete1',
//			iconMask: true,
			listeners: {
				tap: { fn: this.onBackButtonTap, scope: this }
			}
		};

		var saveButton = {
			xtype: 'button',
			text: "OK",
			ui: 'action',
//			Icon with checkmark ...
//			iconCls: 'check2',
//			iconMask: true,
			listeners: {
				tap: { fn: this.onSaveButtonTap, scope: this }
			}
		};

		var buttonPanel = {
			xtype: 'toolbar',
			docked: 'bottom',
			layout: { pack: 'center' },
			items: [
				backButton,
				{ xtype: 'spacer'},
				saveButton
			]
		};

		var carousel = {
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
					xtype: 'itsmpatchform'
				},
				{
					xtype: 'itsmjiraform'
				}
			]
		};

		this.add([carousel,buttonPanel]);

/*
		var settings = Ext.getStore("settings");
		var rec = settings.getAt(0);
		var data = [];
		var init;
		try {
			data = rec.get('settingsContainer');
			init = data[0];
		}
		catch(e) {
			console.error("Application is not configured yet");
			init = 'http://server:port/nd';
		}

		console.log( 'ConfigurationView: ' + init );
*/

//		this.setValues( {caseNo: 'WEV-0975-011' } );
		console.log( 'searchPanel init' );
    },
	 // >>>

	onSaveButtonTap: function() {
		var obj = {};
		debugger;
		console.log("itsmLinkForms.save event fired. Active page index = " + this.getItems().items[1].activeIndex);
		try {
			if( this.getItems().items[0].activeIndex == 0 ) {
				var form = Ext.ComponentQuery.query('itsmpatchform')[0];
				if( typeof form == "undefined" ) 
					throw({name:"Form Problem", message:"Cannot find requested form"});
				var src = this.getItems().items[0].getItems().items[1];
				if( form.getId() != src.getId() ) 
					throw({name:"Form Problem", message:"Cannot find requested form"});
				obj.patch = src.getFields().patch.getValue();
				obj.drop = src.getFields().unlink.getValue();
				this.fireEvent('linkCaseCommand', opentext.data.activeCase, obj );
			}
			// The second page is the new patch form
			if( this.getItems().items[0].activeIndex == 1 ) {
				var form = Ext.ComponentQuery.query('itsmjiraform')[0];
				if( typeof form == "undefined" ) 
					throw({name:"Form Problem", message:"Cannot find requested form"});
				var src = this.getItems().items[0].getItems().items[2];
				if( form.getId() != src.getId() ) 
					throw({name:"Form Problem", message:"Cannot find requested form"});
				obj.jira = src.getFields().jiraid.getValue();
				this.fireEvent("linkJiraCommand", opentext.data.activeCase, obj);
			}
		}
		catch(e) {
			Ext.Msg.alert("Form", "Cannot access form data" );
			console.error(e.name + ": " + e.message);
		}
	},

	onBackButtonTap: function() {
		console.log("view.PatchForm.backButtonTap" );
		this.fireEvent('backCaseLinkCommand' );
	},

	onCarouselItemChange: function() {
		console.log("itsmLinkForms.carousel.itemChange event fired. Active page index = " + this.getItems().items[0].activeIndex);
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
 >>> */
});

