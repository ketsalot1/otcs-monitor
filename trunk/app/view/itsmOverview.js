Ext.define("itsm.view.itsmOverview", {
	extend: 'Ext.carousel.Carousel',
	alias: 'widget.itsmoverview',
	config: {
		items: [
			{
//				html: "<img src='resources/images/otcs-5y.png' width='100%'/>",
				xtype: 'aboutscreen',
//				store: Ext.getStore("aboutInfo"),
				style: 'background-color: #5AB5F5; border: 4px; border-radius: 12px; border-shadow: 7px 7px 7px blue;'
			},
			{
				html: "<img src='resources/images/otcs-6m.png' width='100%'/>"
//				html: "<div id='otcs-image-container-6m'></div>"
			},
			{
				html: "<img src='resources/images/otcs-1y.png' width='100%'/>"
//				html: "<div id='otcs-image-container-1y'></div>"
			},
			{
				html: "<img src='resources/images/otcs-5y.png' width='100%'/>"
//				html: "<div id='otcs-image-container-5y'></div>"
			}
		]
	}
});
