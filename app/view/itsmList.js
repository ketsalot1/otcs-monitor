Ext.define("itsm.view.itsmList", {
    extend: "Ext.dataview.List",
    alias: "widget.itsmlist",
    config:{
        scrollable:'vertical'
    },
    config: {
        loadingText: "Loading Cases...",
        emptyText: '</pre><div class="notes-list-empty-text">Cannot retrieve data from the server. Server down or data set empty.</div><pre>',
        onItemDisclosure: true,
		  ui: 'round',
        grouped: true,
//        itemTpl: '</pre><div class="list-item-title">{title}</div><pre>'
//        itemTpl: '</pre><img src="resources/images/info.png"><div class="list-item-title">{title}</div><div class="list-item-narrative">({code})</div><pre>'
        itemTpl: '<div><table><tr><td><img src="{icon}" width="24px" height="24px"></td><td><p>&nbsp;&nbsp;</p></td><td><p class="list-item-title">{title}</p></td></tr></table></div>'
    }
});

