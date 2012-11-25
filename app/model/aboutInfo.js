Ext.define("itsm.model.aboutInfo", {
    extend: "Ext.data.Model",
    config: {
        idProperty: 'id',
        fields: [
            { name: 'id', type: 'int' },
            { name: 'name', type: 'string' },
            { name: 'descr', type: 'string' }
        ],
        validations: [
            { type: 'presence', field: 'id' },
        ]
    }
});
