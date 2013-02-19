Ext.define("itsm.model.itsm", {
    extend: "Ext.data.Model",
    config: {
        idProperty: 'id',
        fields: [
            { name: 'id', type: 'int' },
            { name: 'category', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'icon', type: 'string' },
            { name: 'code', type: 'string' }
        ],
        validations: [
            { type: 'presence', field: 'id' },
            { type: 'presence', field: 'category' },
            { type: 'presence', field: 'title', message: 'Please enter a title for this note.' },
            { type: 'presence', field: 'code', message: 'Code is required.' }
        ]
    }
});
