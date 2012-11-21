Ext.define("itsm.view.itsmOverview", {
	extend: 'Ext.Carousel',
	alias: 'widget.itsmoverview',
	defaults: {
		styleHtmlContent: true
	},
	items: [
		{
			html: '1 year overview',
			style: "id: otcs-image-container-1y"
		},
		{
			html: '6 months overview',
			style: "id: otcs-image-container-6m"
		}
	]
});
