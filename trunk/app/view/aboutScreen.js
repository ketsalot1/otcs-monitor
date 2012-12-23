Ext.define('itsm.view.aboutScreen', {
	extend: 'Ext.Container',
   alias: 'widget.aboutscreen',
	config: {	
		styleHtmlContent: true,
		data: [{
			name: 'OCTS Report Data',
			descr: '2012-11-21 v1.21'
		}, {
			name: 'Jira Patch Report',
			descr: '2012-11-23 v1.23'
		}], // data
      tpl: '<p><b>OTCS Monitor 1.0</b></br>by Martin Metal</p><tpl for="."><div><strong>{name}</strong><div class="list-item-narrative">({descr})</div></div></tpl>'
	}
});
