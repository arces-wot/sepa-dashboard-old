$(function(){

    ////////////////////////////////////////////////////////////////////////////////
    //
    // TOP TOOLBAR
    //
    ////////////////////////////////////////////////////////////////////////////////
    
    var toolbarStyle = 'radius: 10px;';

    // toolbar
    $('#topToolbarSection').w2toolbar({
	name: 'topToolbar',
	items: [
	    { type: 'html',  id: 'httpLabel',  html: 'HTTP host:&nbsp;' },
	    { type: 'html', id: 'httpEntry', html: '<input type="text" id="httphostentry" name="httphost" value="http://localhost:8000/sparql">' },
	    { type: 'break' },
	    { type: 'html',  id: 'wsLabel',  html: 'WebSocket host:&nbsp;' },
	    { type: 'html', id: 'wsEntry', html: '<input type="text" id="wshostentry" name="wshost">' },
	    { type: 'break' },
	    { type: 'button', id: 'connectButton', text: 'Connect/Disconnect'},
	    { type: 'button', id: 'loadSapButton', text: 'Load SAP file'}
	]
    });    

    ////////////////////////////////////////////////////////////////////////////////
    //
    // NAMESPACE LAYOUT
    //
    ////////////////////////////////////////////////////////////////////////////////

    // namespaces section
    $('#namespacesSection').w2layout({
        name: 'nsLayout',
	style: toolbarStyle,
        panels: [
            { type: 'left', size: '50%', content: 'left', style: 'margin: 5px; margin-top: 0px; margin-left: 0px;' },
            { type: 'right', size: '50%', content: '<div id="nsForm"></div>', style: 'margin: 5px; margin-top: 0px; margin-right: 0px;' },
        ]
    });
   
    // namespaces grid
    $().w2grid({	
	name: 'nsGrid',	
	columns: [
	    { field: 'prefix', caption: 'Prefix', size: '20%' },
	    { field: 'namespace', caption: 'Namespace', size: '80%' }
	]
    });
    w2ui['nsLayout'].content('left', w2ui['nsGrid']);

    // namespace html form
    nsFormHtml = "<div id='nsForm' style='width: 100%;'>" +
	"<div class='w2ui-page page-0'>" + 
        "<div class='w2ui-field'><label>Prefix:</label>" +
	"<div><input name='prefixEntry' type='text' style='width: 385px; height: 80px; resize: none'></div></div>" +
        "<div class='w2ui-field'><label>Namespace:</label>" +
	"<div><input name='namespaceEntry' type='text' style='width: 385px; height: 80px; resize: none'></div></div>" +
	"</div>" + 
	"<div class='w2ui-buttons'>" +
        "<button class='w2ui-btn' name='update'>Add</button>" +
        "<button class='w2ui-btn' name='query'>Delete</button>" +
	"</div></div>"    

    // namespaces form    
    $('#nsForm').w2form({ 
        name  : 'nsFormJs',
	style: 'height: 100%',	
	formHtml : nsFormHtml,
        fields: [
    	    { field: 'prefixEntry', type: 'text', name: 'Prefix'},
    	    { field: 'namespaceEntry',  type: 'text', name: 'Namespace' },
        ],
        actions: {
            'Add': function (event) {

		// get the current number of items in the grid
		var g = w2ui['nsGrid'].records.length;	

		// retrieve prefix and namespace
		var p = $('#Prefix').val();		
		var n = $('#Namespace').val();

		// add the element to the grid
		w2ui['nsGrid'].add({recid: g+1, prefix: p, namespace: n});
	    },	    
	    'Delete': function (event) {

		// get the selected indices
		var s = w2ui['nsGrid'].getSelection();

		// remove
		w2ui['nsGrid'].remove(s);
	    }
        }
    });

    
    ////////////////////////////////////////////////////////////////////////////////
    //
    // UPDATE/QUERY/SUBSCRIBE LAYOUT
    //
    ////////////////////////////////////////////////////////////////////////////////
    
    // uqs section
    $('#uqsSection').w2layout({
        name: 'uqsLayout',
	style: 'radius: 10px; padding: 5px; height: 370px;',
        panels: [
            { type: 'left', size: '50%', content: 'left', style: 'margin: 5px; margin-top: 0px; margin-left: 0px;' },
            { type: 'right', size: '50%', content: 'right', style: 'margin: 5px; margin-top: 0px; margin-right: 0px;' },	    
        ]
    });
    
    ////////////////////////////////////////////////////////////////////////////////
    //
    // UPDATE/QUERY LAYOUT
    //
    ////////////////////////////////////////////////////////////////////////////////
    
    // update layout
    $().w2layout({
        name: 'updateLayout',
	style: 'border-radius: 10px; padding: 5px; height: 350px;',
        panels: [
            { type: 'left', size: '50%', content: 'left', style: 'margin: 5px; margin-top: 0px; margin-left: 0px;' },
            { type: 'right', size: '50%', content: 'right', style: 'margin: 5px; margin-top: 0px; margin-right: 0px;' },
	    { type: 'bottom', size: '50%', content: '<div id="uForm"></div>', style: 'margin: 5px; border-style: none;' },
        ]
    });   
    w2ui['uqsLayout'].content('left', w2ui['updateLayout']);

    // updateForm
    updateForm = "<div id='updateForm' style='width: 750px;'>" +
	"<div class='w2ui-page page-0'>" + 
        "<div class='w2ui-field'>" +
        "<label>Text:</label>" +
	"<div>" +
        "<textarea name='updateQueryText' type='text' style='width: 385px; height: 80px; resize: none'></textarea>" +
        "</div></div></div>" +
	"<div class='w2ui-buttons'>" +
        "<button class='w2ui-btn' name='update'>Update</button>" +
        "<button class='w2ui-btn' name='query'>Query</button>" +
	"</div></div>"    
    $().w2form({
	name: 'uForm',
	formHTML: updateForm,
	fields: [
	    { name: 'updateQueryText',
	      type: 'text'}	    
	],
	actions: {
	    update: function(){

		// console log
		console.log("Performing a SPARQL UPDATE request");

		// get the HTTP host
		httpHost = $('#httphostentry').val();
		
		// sparql update
		updateQuery = $('#updateQueryText').val();
		console.log(updateQuery);

		// do an HTTP POST request
		var req = $.ajax({
		    url: httpHost,
		    crossOrigin: true,
		    method: 'POST',
		    contentType: "application/sparql-update",
		    data: updateQuery,	
		    statusCode: {
			200: function(){
			    console.log("200 OK - Request Successful");
			    $('#resulttext').val("200 OK - Request Successful");
			}
		    }
		});
		
	    },
	    query: function(){}
	}
    });
    w2ui['updateLayout'].content('bottom', w2ui['uForm']);
    
    // updates list
    $().w2grid({	
	name: 'uGrid',	
	columns: [
	    { field: 'update', caption: 'SPARQL Update/Query', size: '100%' },
	]
    });
    w2ui['updateLayout'].content('left', w2ui['uGrid']);

    // update forced bindings grid
    $().w2grid({	
	name: 'ufbGrid',	
	columns: [
	    { field: 'uvariable', caption: 'Variable', size: '35%' },
	    { field: 'uvalue', caption: 'Value', size: '35%' },
	    { field: 'uliteral', caption: 'Literal', size: '30%' }
	]
    });
    w2ui['updateLayout'].content('right', w2ui['ufbGrid']);

    ////////////////////////////////////////////////////////////////////////////////
    //
    // SUBSCRIBE LAYOUT
    //
    ////////////////////////////////////////////////////////////////////////////////
    
    // subscribe layout
    $().w2layout({
        name: 'subscribeLayout',
	style: 'border-radius: 10px; padding: 5px; height: 350px;',
        panels: [
            { type: 'left', size: '50%', content: 'left', style: 'margin: 5px; margin-top: 0px; margin-left: 0px;' },
            { type: 'right', size: '50%', content: 'right', style: 'margin: 5px; margin-top: 0px; margin-right: 0px;' },
	    { type: 'bottom', size: '50%', content: '<div id="sForm"></div>', style: 'margin: 5px; border-style: none;' },
        ]
    });   
    w2ui['uqsLayout'].content('right', w2ui['subscribeLayout']);

    // subscribeForm
    subscribeForm = "<div id='subscribeForm' style='width: 750px;'>" +
	"<div class='w2ui-page page-0'>" + 
        "<div class='w2ui-field'>" +
        "<label>Text:</label>" +
	"<div>" +
        "<textarea name='subText' type='text' style='width: 385px; height: 80px; resize: none'></textarea>" +
        "</div></div></div>" +
	"<div class='w2ui-buttons'>" +
        "<button class='w2ui-btn' name='subscribe'>Subscribe</button>" +
        "<button class='w2ui-btn' name='unsubscribe'>Unsubscribe</button>" +
	"</div></div>"    
    $().w2form({
	name: 'sForm',
	formHTML: subscribeForm,
	fields: [
	    { name: 'subText',
	      type: 'text'}	    
	]
    });
    w2ui['subscribeLayout'].content('bottom', w2ui['sForm']);
    
    // updates list
    $().w2grid({	
	name: 'sGrid',	
	columns: [
	    { field: 'subscribe', caption: 'SPARQL Subscription', size: '100%' },
	]
    });
    w2ui['subscribeLayout'].content('left', w2ui['sGrid']);

    // update forced bindings grid
    $().w2grid({	
	name: 'sfbGrid',	
	columns: [
	    { field: 'svariable', caption: 'Variable', size: '35%' },
	    { field: 'svalue', caption: 'Value', size: '35%' },
	    { field: 'sliteral', caption: 'Literal', size: '30%' }
	]
    });
    w2ui['subscribeLayout'].content('right', w2ui['sfbGrid']);    

    ////////////////////////////////////////////////////////////////////////////////
    //
    // BOTTOM TOOLBAR
    //
    ////////////////////////////////////////////////////////////////////////////////
    
    // bottom toolbar
    $('#bottomToolbarSection').w2toolbar({
	name: 'bottomToolbar',
	items: [
	    { type: 'button', id: 'clearButton', text: 'Clear'}
	]
    });    

    
});
