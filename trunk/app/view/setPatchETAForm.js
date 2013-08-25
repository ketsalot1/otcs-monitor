Ext.define("itsm.view.setPatchETAForm", {
	extend: "Ext.form.Panel",
	alias: "widget.setpatchetaform",
	config: {
		title: 'Set Patch ETA',
		id: 'setPatchETAFormId',
		iconCls: 'refresh',
		layout: 'vbox',
		scrollable: false // prevent the form pannel to move around when using carousel control. Smooth transition
								// check on small display, if the from does not need scrolling though.
	},

	initialize: function () { // <<<
		this.callParent(arguments);

		var eta = {
			xtype: 'datepickerfield',
			label: 'Date:',
			name: 'eta',
			labelWidth: '32%',
			destroyPickerOnHide: false,
			value: new Date(),
			picker: {
				yearFrom: 2012,
				yearTo: 2018
			}
		};

		var formFrame = {
			xtype: 'fieldset',
			title: 'Set new ETA for patch',
			instructions: 'Set the estimated time of arrival for patch.',
			items: [
				eta
			]
		};	

		this.add([formFrame]);

//		this.setValues( {caseNo: 'WEV-0975-011' } );
		console.log( 'setPatchETAForm init' );
    },
	 // >>>

});

