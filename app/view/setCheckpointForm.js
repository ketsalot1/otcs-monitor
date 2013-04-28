Ext.define("itsm.view.setCheckpointForm", {
	extend: "Ext.form.Panel",
	alias: "widget.setcheckpointform",
	config: {
		title: 'Set Checkpoint',
		id: 'setCheckpointFormId',
		iconCls: 'refresh',
		layout: 'vbox',
		scrollable: false // prevent the form pannel to move around when using carousel control. Smooth transition
								// check on small display, if the from does not need scrolling though.
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var eta = {
			xtype: 'datepickerfield',
			label: 'Checkpoint on:',
			name: 'checkpoint',
			labelWidth: '32%',
			destroyPickerOnHide: false,
			value: new Date(),
			picker: {
				yearFrom: 2012,
				yearTo: 2016
			}
		};

		var formFrame = {
			xtype: 'fieldset',
			title: 'Set Checkpoint',
			instructions: 'Set the date of committed checkpoint. Is either delivery or update',
			items: [
				eta
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

