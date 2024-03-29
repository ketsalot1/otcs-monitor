Ext.define("itsm.view.patchMgmtUpdateForm", {
	extend: "Ext.form.Panel",
	alias: "widget.patchmgmtupdateform",
	config: {
		title: 'Update a Patch',
		id: 'patchMgmtUpdateFormId',
		iconCls: 'refresh',
		layout: 'vbox',
		scrollable: false // prevent the form pannel to move around when using carousel control. Smooth transition
								// check on small display, if the from does not need scrolling though.
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var patch = {
			xtype: 'selectfield',
			label: 'Patch:',
			name: 'patch',
			labelWidth: '32%',
			store: Ext.getStore('patches')
			/*
			options: [
				{ text: "WEV-0975-011", value: 1},
				{ text: "WEV-1020-004", value: 2},
				{ text: "WIV-0970-022", value: 3},
				{ text: "ESC-0971-008", value: 4}
			]
			*/
		};

		var eta = {
			xtype: 'datepickerfield',
			label: 'ETA:',
			name: 'eta',
			labelWidth: '32%',
			destroyPickerOnHide: false,
			value: new Date(),
			picker: {
				yearFrom: 2012,
				yearTo: 2014
			}
		};

		var released = {
			xtype: 'togglefield',
			name: 'released',
			label: 'is open?:',
			labelWidth: '32%',
		};

		var formFrame = {
			xtype: 'fieldset',
			title: 'Patch Update',
			instructions: 'Set the status and ETA for a patch. Swipe the screen to get tto the "new patch" section',
			items: [
				patch,
				eta,
				released
			]
		};	

		this.add([formFrame]);

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

		this.setValues( {caseNo: 'WEV-0975-011' } );
		console.log( 'searchPanel init' );
    },
	 // >>>

});

