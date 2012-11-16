Ext.define("itsm.controller.itsm", {
	extend: "Ext.app.Controller",

	slideLeftTransition: { 
			type: 'slide', 
			direction: 'left' 
	},

	slideRightTransition: { 
			type: 'slide', 
			direction: 'right'
	},

	config: {
		refs: {
				// We're going to lookup our views by xtype. This is added 
				// throug the property 'alias' in the view definition.
				mainListContainer: "mainlistcontainer",
				itsmList: "itsmlist",
				itsmDetail: "itsmdetail",
				configurationView: "configurationview",
				searchForm: "searchform",
				searchResultView: "searchresultview",
				searchResultDetail: "searchresultdetail",
		},
		control: {
				mainListContainer: {
					// The commands fired by the notes list container.
//					newNoteCommand: "onNewNoteCommand",
//					deleteNoteCommand: "onDeleteNoteCommand",
//					editNoteCommand: "onEditNoteCommand"
					itsmDetailCommand: "onITSMDetail",
					settingsCommand: "onSettings",
					searchCommand: "onSearch"
				},
				itsmDetail: {
//					showAboutBox: "onShowAboutBox",
//					saveNoteCommand: "onSaveNoteCommand",
//					deleteNoteCommand: "onDeleteNoteCommand",
					detailBackCommand: "onBackMainList"
				},
				configurationView: {
					saveSettingsCommand:	"onSaveSettings",
					purgeSettingsCommand: "onPurgeSettings"
				},
				searchForm: {
					searchCaseCommand: 'onSearchCase'
				},
				searchResultView: {
					searchBackCommand: 'onSearchBack'
				}
		}
	},

	// Commands.
/* <<<
	onEditNoteCommand: function (list, record) {
		console.log("controller.Notes_1.onEditNoteCommand");
		this.activateNoteEditor(record);
	},

	onBackNoteCommand: function() {
		console.log("controller.Notes_1.onBackNoteCommand");
		this.activateNotesList();
	},

	onNewNoteCommand: function () {
		console.log("controller.Notes_1.onNewNoteCommand");

		var now = new Date();
		var noteId = (now.getTime()).toString() + (this.getRandomInt(0, 100)).toString();

		var newNote = Ext.create("noteBook.model.Note", {
			id: noteId,
			dateCreated: now,
			title: "",
			narrative: ""
		 });

	 this.activateNoteEditor(newNote);
	},

	onDeleteNoteCommand: function() {
		var noteEditor;
		var currentNote;
		var store;

		console.log("controller.Notes_1.onDeleteNoteCommand");

		try {
			noteEditor = this.getNoteEditor();
			currentNote = noteEditor.getRecord();
			store = Ext.getStore('Notes'); 

			store.remove(currentNote);
			store.sync();

			this.activateNotesList();
		}
		catch(e) {
			console.error( "Exception: " + e.name + " - " + e.message );
			Ext.Msg.alert("Exception", e.message, null, null );
		}
	},
	
	onSaveNoteCommand: function () {
		console.log("controller.Notes_1.onSaveNoteCommand");

		var noteEditor = this.getNoteEditor();
		var currentNote = noteEditor.getRecord();
		var newValues = noteEditor.getValues();

		// Update the current note's fields with form values.
		currentNote.set("title", newValues.title);
		currentNote.set("narrative", newValues.narrative);

		var errors = currentNote.validate();

		if (!errors.isValid()) {
			Ext.Msg.alert('Wait!', errors.getByField("title")[0].getMessage(), Ext.emptyFn);
			currentNote.reject();
			return;
		}

		var notesStore = Ext.getStore("Notes");

		if (null == notesStore.findRecord('id', currentNote.data.id)) {
			notesStore.add(currentNote);
		}

		notesStore.sync();

		notesStore.sort([{ property: 'dateCreated', direction: 'DESC'}]);

		this.activateNotesList();
	},

	getRandomInt: function (min, max) {
		 return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	activateNoteEditor: function (record) {
		var noteEditor = this.getNoteEditor();
		noteEditor.setRecord(record); // load() is deprecated.
		Ext.Viewport.animateActiveItem(noteEditor, this.slideLeftTransition);
	},

	activateNotesList: function () {
		Ext.Viewport.animateActiveItem(this.getNotesListContainer(), this.slideRightTransition);
	},
>>> */

	onBackMainList: function() {
		console.log("controller.itsm.onBackCommand");
		this.activateMainView();
	},

	onSearchBack: function() {
		console.log("controller.itsm.onSearchBackCommand");
		this.activateMainView();
	},

	onITSMDetail: function(obj, record) {
		console.log("controller.itsm.onITSMDetail");
		console.log( record );
		this.activateITSMDetail(record);
	},

	activateMainView: function () {
		Ext.Viewport.animateActiveItem(this.getMainListContainer(), this.slideRightTransition);
	},

	onSettings: function() {
		Ext.Viewport.animateActiveItem(this.getConfigurationView(), this.slideLeftTransition);
	},

	onSearch: function() {
		Ext.Viewport.animateActiveItem(this.getSearchForm(), this.slideLeftTransition);
	},

	activateITSMDetail: function (record) {
		console.log("controller.itsm.activateITSMDetail");

		var rec;
		var data = [];
		var settings = Ext.getStore("settings");
		var s = Ext.getStore('desktopITSM');

		try {
			rec = settings.getAt(0);
			data = rec.get('settingsContainer');
			var hostName = data[0];
			console.log( 'controller: URL=' + s.getProxy().getUrl() );
//			s.getProxy().setUrl('http://localhost:18080/jsfks/sencha?otcs=' + record + '&data02=wolle_lehni' );
//			var hostName = settings.getData().items[0].data.hostName;
			s.getProxy().setUrl( hostName + '?otcs=' + record );
			console.log( 'controller: URL=' + s.getProxy().getUrl() );
			s.load();
			Ext.Viewport.animateActiveItem(this.getItsmDetail(), this.slideLeftTransition);
		}
		catch(e) {
			Ext.Msg.alert( e.name );
		}
	},


	onSaveSettings: function(hostName) { // <<<
		var rec;
		var data = [];
		var settings = Ext.getStore("settings");
		var s = Ext.getStore("itsm");

		console.log('controller.itsm.saveSettings:' + hostName );

		try {
			rec = settings.getAt(0);
			data = rec.get('settingsContainer');
			data[0] = hostName;
			rec.set('settingsContainer', data );
		}
		catch(e) {
			settings.add({'settingsContainer': [hostName] } );
		}
		settings.sync();

		s.getProxy().setUrl( hostName + '?otcs=Descriptor' );
		console.log( 'controller: setting Descriptors URL=' + s.getProxy().getUrl() );
		s.load();

		this.activateMainView();
	},
	// >>>

	onSearchCase: function(caseNo) {
		var rec,hostName;
		var data = [];
		var settings = Ext.getStore("settings");
		var s = Ext.getStore('searchresult');

		console.log('controller search for case No.>' + caseNo + '<' );

		try {
			rec = settings.getAt(0);
			data = rec.get('settingsContainer');
			hostName = data[0];
			s.getProxy().setUrl( hostName + '?search=' + caseNo );
			console.log('controller setting search request >' + s.getProxy().getUrl() + '<' );
			s.load();

			Ext.Viewport.animateActiveItem(this.getSearchResultView(), this.slideLeftTransition);
		}
		catch(e) {
			console.error( e.message );
		}
	},

	onPurgeSettings: function() {
		console.log('controller: purging Configuration');
		try {
			localStorage.removeItem('new-otcs-monitor-settings');
//			localStorage.clear();
		}
		catch(e) {
			Ext.Msg.alert(e.name + "Error purging settings" );
		}
	},


	// Base Class functions.
	launch: function () {
		this.callParent(arguments);
		console.log("controller.itsm.launch");
	},

	init: function () {
		this.callParent(arguments);
		console.log("controller.itsm.init");
	 }
});

