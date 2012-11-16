Ext.define("itsm.view.searchResultDetail", {
    extend: "Ext.dataview.List",
    alias: "widget.searchresultdetail",
    config:{
        scrollable:'vertical'
    },
    config: {
        loadingText: "Loading Cases...",
        emptyText: '<div class="notes-list-empty-text">No case found.</div>',
        onItemDisclosure: true,
        grouped: false,
        itemTpl: '<div class="list-item-title">{title}</div><div class="list-item-narrative">{details}</div>'
    }
});

