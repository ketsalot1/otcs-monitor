Ext.define("itsm.view.itsmOverview", {
	extend: 'Ext.carousel.Carousel',
	alias: 'widget.itsmoverview',
	config: {
		items: [
			{
				html: "<div id='itsm-statistics-container'><h1>Not Initialized</h1></div>",

//				xtype: 'aboutscreen',
/*
				xtype: 'dataview',

				store: {
					fields: ['case_total', 'case_pending', 'case_closed', 'case_delta_w2w', 'case_delta_m2m', 'patches_total'],
					data: [
						{ case_total: 64, case_pending: 4, case_closed: 12, case_delta_w2w: -4, case_delta_m2m: 3, patches_total: 12 }
        			]
    			},
//				store: 'itsm.store.itsmOverview',

				itemTpl: 'Cases {case_total} totaly, {case_pending} not processed',

//				store: 'itsm.store.itsmOverview',
//				itemTpl: '<div><p>Total monitored cases: {case_total}</p><p>Actively monitored: {case_pending}</p><p>Recently closed: {case_closed}</p><p>Week to week: {case_delta_w2w}</p><p>Month to Month: {case_delta_m2m}</p><p>Patches in construction: {patches_total}</p></div>',
*/
				style: 'background-color: #5AB5F5; border: 4px; border-radius: 12px; border-shadow: 7px 7px 7px blue;'
			},
			{
//				html: "<div id='otcs-image-container-6m'></div>"
				html: "<img src='resources/images/otcs-6m.png' width='100%'/>",
				style: 'background-color: #5AB5F5; border: 4px; border-radius: 12px; border-shadow: 7px 7px 7px blue;'
			},
			{
				html: "<img src='resources/images/otcs-1y.png' width='100%'/>",
				style: 'background-color: #5AB5F5; border: 4px; border-radius: 12px; border-shadow: 7px 7px 7px blue;'
//				html: "<div id='otcs-image-container-1y'></div>"
			},
			{
				html: "<img src='resources/images/otcs-5y.png' width='100%'/>",
				style: 'background-color: #5AB5F5; border: 4px; border-radius: 12px; border-shadow: 7px 7px 7px blue;'
//				html: "<div id='otcs-image-container-5y'></div>"
			}
		]
	}
});
