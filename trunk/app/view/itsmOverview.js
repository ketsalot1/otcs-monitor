Ext.define("itsm.view.itsmOverview", {
	extend: 'Ext.Container',
	requires: [
		'Ext.carousel.Carousel'
	],
	alias: 'widget.itsmoverview',
	confing: {
		xtype: 'carousel',
		items: [
			{
				html: "<img src='resources/images/otcs-6m.png' width='284px'/>"
			},
			{
				html: "<img src='resources/images/otcs-1y.png' width='284px'/>"
			},
			{
				html: "<img src='resources/images/otcs-5y.png' width='284px'/>"
			}
		],
	}
});
