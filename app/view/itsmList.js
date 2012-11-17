Ext.define("itsm.view.itsmList", {
    extend: "Ext.dataview.List",
    alias: "widget.itsmlist",
    config:{
        scrollable:'vertical'
    },
    config: {
        loadingText: "Loading Cases...",
        emptyText: '</pre><div class="notes-list-empty-text">No case found.</div><pre>',
        onItemDisclosure: true,
        grouped: true,
//        itemTpl: '</pre><div class="list-item-title">{title}</div><pre>'
        itemTpl: '</pre><div class="list-item-title">{title}</div><div class="list-item-narrative">({code})</div><pre>'
    }
});

