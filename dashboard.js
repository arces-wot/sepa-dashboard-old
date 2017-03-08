$(function(){

    var subscriptions = {};

    ////////////////////////////////////////////////////////////////////////////////
    //
    // BUILD PREFIX SECTION FUNCTION
    //
    ////////////////////////////////////////////////////////////////////////////////

    function build_prefix_section(){
	ps = "";
	for (record in w2ui['nsGrid'].records){
	    ps = ps + "PREFIX " + w2ui['nsGrid'].records[record]["prefix"] + ": <" + w2ui['nsGrid'].records[record]["namespace"] + ">\n";
	}
	return ps;
    };

    ////////////////////////////////////////////////////////////////////////////////
    //
    // LOG FUNCTION
    //
    ////////////////////////////////////////////////////////////////////////////////

    function log(level, text){
	
	t = new Date();
	msg = "[" + t.toTimeString() + "][" + level + "] " + text;
	$("#debugText").empty();
	$("#debugText").text(msg);
	console.log(msg);

    };   

    ////////////////////////////////////////////////////////////////////////////////
    //
    // CONFIGURATION LAYOUT
    //
    ////////////////////////////////////////////////////////////////////////////////

    var toolbarStyle = 'radius: 10px;';

    $('#sapForm').w2form({
        name  : 'sapFormJs',
	style: "margin: 5px;",
        fields: [
    	    { field: 'sapFile', type: 'file' },
        ],
        actions: {
	    clearBtn: function(event){

		// clear the namespaces grid
		w2ui['nsGrid'].clear();

		// clear the namespace and prefix text entries
		$('#Prefix').val("");		
		$('#Namespace').val("");

		// clear the update/query grid
		w2ui['uGrid'].clear();

		// clear the update/query forced bindings grid
		w2ui['ufbGrid'].clear();

		// clear the update/query form
		$('#updateHost').val("");
		$('#updateText').val("");

		// clear the update/query grid
		w2ui['sGrid'].clear();

		// clear the update/query forced bindings grid
		w2ui['sfbGrid'].clear();

		// clear the update/query form
		$('#subscribeHost').val("");
		$('#subText').val("");

		// clear the results area
		$('#resultsLeftTextarea').val("");

		// clear debug area
		$("#debugText").empty();

		// debug
		log("INFO", "Cleaning completed!");

	    },
            loadSapBtn: function (event) {

		// check if file reader is supported
		if ( ! window.FileReader ) {
		    alarm( 'FileReader API is not supported by your browser.' );
		    log("ERROR", 'FileReader API is not supported by your browser.' );
		    return false;
		}

		// load data
		var $i = $( '#sapFile' );		
		input = $i[0];
		if ( input.files && input.files[0] ) {
		    file = input.files[0];

		    // create a mew instance of the file reader
		    fr = new FileReader();		    
		    var text;
		    fr.onload = function () {
			
			var decodedData = fr.result;
			
			// parse the XML
			xmlDoc = $.parseXML(decodedData);
			$xml = $(xmlDoc);
			
			// namespaces
			$xml.find("namespace").each(function(){

			    // retrieve prefix and namespace
			    p = $(this).attr('prefix');
			    n = $(this).attr('suffix');

			    // get the current number of items in the grid
			    var g = w2ui['nsGrid'].records.length;	

			    // add the element to the grid
			    w2ui['nsGrid'].add({recid: g+1, prefix: p, namespace: n});
			});
			
			// retrieve subscriptions
			$xml.find("subscribe").each(function(){
			    
			    // retrieve the update
			    var sname = $(this).attr("id");

			    // get the subscription text
			    var stext = $(this).find("sparql").text();

			    // retrieve the forced bindings
			    var fbindings = [];
			    $(this).find("binding").each(function(){
				fbindings.push({"variable":$(this).attr("variable"), "value":$(this).attr("value"), "type":$(this).attr("type")}) ;
			    });

			    // get the current number of items in the grid
			    var g = w2ui['sGrid'].records.length;	

			    // add the element to the grid
			    w2ui['sGrid'].add({recid: g+1, subscribe: sname, forcedBindings: JSON.stringify(fbindings), subscribeText: stext });

			});

			// retrieve updates
			$xml.find("update").each(function(){
			    
			    // retrieve the update
			    var uname = $(this).attr("id");

			    // get the update text
			    var utext = $(this).find("sparql").text();

			    // retrieve the forced bindings
			    var fbindings = [];
			    $(this).find("binding").each(function(){
				fbindings.push({"variable":$(this).attr("variable"), "value":$(this).attr("value"), "type":$(this).attr("type")}) ;
			    });

			    // get the current number of items in the grid
			    var g = w2ui['uGrid'].records.length;	

			    // add the element to the grid
			    w2ui['uGrid'].add({recid: g+1, updateName: uname, forcedBindings: JSON.stringify(fbindings), updateText: utext });

			});			

			// retrieve sepa host		   
			$xml.find("parameters").each(function(){

			    // retrieve prefix and namespace
			    url = $(this).attr('url');
			    httpport = $(this).attr('updatePort');
			    wsport = $(this).attr('subscribePort');
			    path = $(this).attr('path');
			    
			    // build http url
			    httpUrl = "http://" + url + ":" + httpport + path;
			    $('#updateHost').val(httpUrl);
			    $('#queryHost').val(httpUrl);

			    // build ws url
			    wsUrl = "ws://" + url + ":" + wsport + path;
			    $('#subscribeHost').val(wsUrl);

			    
			});

		    };
		    fr.readAsText(file);

		    // debug
		    log("INFO", "File parsing completed!");
		    
		} else {
		    // Handle errors here
		    alert("File not selected or browser incompatible.");
		    log("ERROR", "File not selected or browser incompatible.");
		}
	    }	    
        }
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
	],
	onClick: function(event){

	    // retrieve the namespace
	    nsItem = w2ui['nsGrid'].get(event["recid"]);

	    // fill fields on the right
	    $('#Prefix').val(nsItem["prefix"]);		
	    $('#Namespace').val(nsItem["namespace"]);	    

	    // debug
	    log("INFO", "Selected prefix " + nsItem["prefix"] + "(namespace " + nsItem["namespace"] + ")");

	}
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
        "<button class='w2ui-btn' name='add'>Add</button>" +
        "<button class='w2ui-btn' name='query'><i class='fa fa-trash' aria-hidden='true'></i>&nbsp;Delete</button>" +
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

		// retrieve prefix and namespace
		var p = $('#Prefix').val();		
		var n = $('#Namespace').val();

		// get the current number of items in the grid
		var g = w2ui['nsGrid'].records.length;	

		// add the element to the grid
		w2ui['nsGrid'].add({recid: g+1, prefix: p, namespace: n});

		// debug
		log("INFO", "Added prefix " + p + " (" + n + ")");
		
	    },	    
	    'Delete': function (event) {

		// get the selected indices
		var s = w2ui['nsGrid'].getSelection();

		// remove
		w2ui['nsGrid'].remove(s);

		// retrieve prefix and namespace
		var p = $('#Prefix').val();		
		var n = $('#Namespace').val();

		// clear fields		
		$('#Prefix').val("");		
		$('#Namespace').val("");

		// debug
		log("INFO", "Deleted prefix " + p + " (" + n + ")");
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
	style: 'radius: 10px; padding: 5px; height: 550px;',
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
	style: 'border-radius: 10px; padding: 5px; 100%;',
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
        "<div class='w2ui-field'><label>Update Host:</label><div>" +
        "<input type='text' value='http://localhost:8000/sparql' name='updateHost' style='width: 385px;'></div></div>" +
        "<div class='w2ui-field'><label>Text:</label><div>" +
        "<textarea name='updateText' type='text' style='width: 385px; height: 80px; resize: none'></textarea></div></div>" +
        "</div>" +
	"<div class='w2ui-buttons'>" +
        "<button class='w2ui-btn' name='update'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;Update</button>" +
	"</div></div>"    

    $().w2form({
	name: 'uForm',
	formHTML: updateForm,
	fields: [
	    { name: 'updateHost', type: 'text' },
	    { name: 'updateText', type: 'text'}	    
	],
	actions: {
	    update: function(){

		// get the HTTP host
		httpHost = $('#updateHost').val();
		
		// sparql update
		update = build_prefix_section() + $('#updateText').val();

		// do an HTTP POST request
		var req = $.ajax({
		    url: httpHost,
		    crossOrigin: true,
		    method: 'POST',
		    contentType: "application/sparql-update",
		    data: update,	
		    statusCode: {
			200: function(){
			    log("INFO", "UPDATE Request Successful (200 OK)");
			}
		    }
		});

	    },
	}
    });
    w2ui['updateLayout'].content('bottom', w2ui['uForm']);
    
    // updates list
    $().w2grid({	
	name: 'uGrid',	
	columns: [
	    { field: 'updateName', caption: 'SPARQL Update', size: '100%' },
	    { field: 'forcedBindings', caption: 'Forced variables', hidden: true },
	    { field: 'updateText', hidden: true }
	],
	onClick: function(event){

	    // retrieve the event
	    uqItem = w2ui['uGrid'].get(event["recid"]);

	    // clear the forced bindings grid	    
	    w2ui['ufbGrid'].clear();

	    // fill
	    var g = w2ui['ufbGrid'].records.length;	
	    bindings = JSON.parse(uqItem["forcedBindings"]);
	    bindings.forEach(function(element){
		g = g+1;
	    	w2ui['ufbGrid'].add({recid: g+1, uvariable: element["variable"], uliteral: element["type"], uvalue: element["value"]});		
	    });

	    // fill the text area
	    $('#updateText').val(uqItem["updateText"]);

	    // debug
	    log("INFO", "Selected update/query " + uqItem["updateName"]);

	}
    });
    w2ui['updateLayout'].content('left', w2ui['uGrid']);

    // update forced bindings grid
    $().w2grid({	
	name: 'ufbGrid',	
	columns: [
	    { field: 'uvariable', caption: 'Variable', size: '35%' },
	    { field: 'uvalue', caption: 'Value', size: '35%', editable: {type:'text'} },
	    { field: 'uliteral', caption: 'Literal', size: '30%' }
	],
	onChange: function(event){

	    console.log("HERE");
	    
	    // get the new value
	    new_value = event.value_new;

	    // get the modified variable
	    modified_variable = w2ui['ufbGrid'].get(event["recid"])["uvariable"];

	    // retrieve the original query
	    uqItem = w2ui['uGrid'].get(w2ui['uGrid'].getSelection())[0];
	    leftrecid = uqItem["recid"];
	    original_query = uqItem["updateText"];
	    var query = original_query;

	    // update its field
	    new_uqItem = uqItem;	    
	    bindings = JSON.parse(uqItem["forcedBindings"]);
	    bindings.forEach(function(element){
		if (element["variable"] === modified_variable){
		    bindings[bindings.indexOf(element)]["value"] = new_value;
		}
	    });
	    new_uqItem["forcedBindings"] = JSON.stringify(bindings);
	    w2ui['uGrid'].set(leftrecid, new_uqItem);
	    
	    // update the query
	    bindings = JSON.parse(uqItem["forcedBindings"]);
	    bindings.forEach(function(element){
	    	if (element["value"] !== ""){
	    	    variable = "?" + element["variable"];
	    	    query = query.split(variable).join(element["value"]);
	    	}
	    });
	    $('#updateText').val(query);

	    // debug
	    log("INFO", "Forced binding updated in Query/Update");
	    
	}
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
	style: 'border-radius: 10px; padding: 5px;',
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
        "<div class='w2ui-field'><label>Query Host:</label><div>" +
        "<input type='text' value='http://localhost:8000/sparql' name='queryHost' style='width: 385px;'></div></div>" +
	"<div class='w2ui-field'><label>Subscribe Host:</label><div>" +
        "<input type='text' value='ws://localhost:9000/sparql' name='subscribeHost' style='width: 385px;'></div></div>" +
        "<div class='w2ui-field'>" +
        "<label>Text:</label>" +
	"<div>" +
        "<textarea name='subText' type='text' style='width: 385px; height: 80px; resize: none'></textarea></div></div>" +
	"<div class='w2ui-field'><label>Active Subs:</label>" +
	"<div><input type='list'  name='activeSubs' style='width: 385px;'></div></div>" +
        "</div>" +
	"<div class='w2ui-buttons'>" +
	"<button class='w2ui-btn' name='query'><i class='fa fa-question' aria-hidden='true'></i>&nbsp;Query</button>" +
        "<button class='w2ui-btn' name='subscribe'><i class='fa fa-chain' aria-hidden='true'></i>&nbsp;Subscribe</button>" +
        "<button class='w2ui-btn' name='unsubscribe'><i class='fa fa-chain-broken' aria-hidden='true'></i>&nbsp;Unsubscribe</button>" +
	"</div></div>"    
    $().w2form({
	name: 'sForm',
	formHTML: subscribeForm,
	fields: [
	    { name: 'queryHost', type: 'text' },
	    { name: 'subscribeHost', type: 'text'},
	    { name: 'subText', type: 'text'},
	    { name: 'activeSubs', type: 'list' }
	],
	actions: {
	    query: function(){

		// get the HTTP host
		httpHost = $('#queryHost').val();
		
		// sparql query
		query = build_prefix_section() + $('#subText').val();
		console.log(update);

		// do an HTTP POST request
		var req = $.ajax({
		    url: httpHost,
		    crossOrigin: true,
		    method: 'POST',
		    contentType: "application/sparql-query",
		    data: query,	
		    statusCode: {
			200: function(data){
			    log("INFO", "QUERY Request Successful (200 OK)");
			    $('#resultsRightTextarea').val(data);
			}
		    }
		});
	    },
	    subscribe: function(event){
		
		// init
		var subid = null;
		
		// retrieve subscription text
		wsText = build_prefix_section() + $("#subText").val();
		
		// retrieve host
		wsHost = $("#subscribeHost").val();

		// open connection 
		var ws = new WebSocket(wsHost);

		// send subscription
		ws.onopen = function(){
		    ws.send("subscribe=" + wsText);
		};

		// handler for received messages
		ws.onmessage = function(event){
		    console.log(event);
		    msg = JSON.parse(event.data);
		    if ("subscribed" in msg){

			// get the subscription id
			subid = msg["subscribed"];

			// store the subid
			$("#activeSubs").w2field()["options"]["items"].push(subid);
			log("INFO", "Subscription " + subid + " started.");

			// store the socket
			subscriptions[subid] = ws;
			
		    } else if ("ping" in msg){
			console.log("ping");
		    } else if ("results" in msg)  {

			// added bindings
			added = msg["addedresults"];
			console.log("ADDED (" + subid + ":");
			console.log(JSON.stringify(added));

			// removed bindings
			removed = msg["removedresults"];
			console.log("REMOVED (" + subid + "):");
			console.log(JSON.stringify(removed));
		    }

		    // put the message in the proper text area
		    current_text = $("#resultsRightTextarea").val();
		    $("#resultsRightTextarea").val(current_text + "\n" + event.data);

		};

		// handler for the ws closing
		ws.onclose = function(event){
		    log("INFO", "Subscription " + subid + " closed.");
		};

	    },
	    unsubscribe: function(event){

		build_prefix_section();

		// get selected
		subid = $("#activeSubs").data("selected")["id"];
		subscriptions[subid].send("unsubscribe=" + subid);
		
		// remove item from dropdown list
		$("#activeSubs").w2field()["options"]["items"].pop(subid);
		$("#activeSubs").w2field().set(null);

		// debug
		log("INFO", "Subscription " + subid + " closed");

	    }
	}
    });
    w2ui['subscribeLayout'].content('bottom', w2ui['sForm']);
    
    // subscriptions list
    $().w2grid({	
	name: 'sGrid',	
	columns: [
	    { field: 'subscribe', caption: 'SPARQL Query/Subscription', size: "100%" },
	    { field: 'forcedBindings', caption: 'Forced variables', hidden: true },
	    { field: 'subscribeText', hidden: true },
	],
	onClick: function(event){

	    // retrieve the event
	    sItem = w2ui['sGrid'].get(event["recid"]);

	    // clear the forced bindings grid	    
	    w2ui['sfbGrid'].clear();

	    // fill
	    var g = w2ui['sfbGrid'].records.length;	
	    bindings = JSON.parse(sItem["forcedBindings"]);
	    bindings.forEach(function(element){
	    	w2ui['sfbGrid'].add({recid: g+1, svariable: element["variable"], sliteral: element["type"], svalue: element["value"]});		
	    });

	    // fill the text area
	    $('#subText').val(sItem["subscribeText"]);

	    // debug
	    log("INFO", "Selected subscription " + sItem["subscribe"]);
	    
	}
    });
    w2ui['subscribeLayout'].content('left', w2ui['sGrid']);

    // subscriptions forced bindings grid
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
    // RESULTS AREA
    //
    ////////////////////////////////////////////////////////////////////////////////

    // results layout
    $("#resultSection").w2layout({
        name: 'resultSectionLayout',
	style: 'border-radius: 10px; padding: 5px; height: 500px;',
        panels: [
            { type: 'left', size: '50%', content: '<div id="resultSectionLeft"></div>', style: 'margin: 5px; margin-top: 0px; margin-left: 0px; height: 100%;' },
            { type: 'right', size: '50%', content: '<div id="resultSectionRight"></div>', style: 'margin: 5px; margin-top: 0px; margin-right: 0px; height: 100%;' },
        ]
    });

    // html code for left results form
    resultsLeftHtmlForm = "<div id='resultsLeftForm' style='width: 100%;'>" +
	"<div class='w2ui-page page-0'>" + 
        "<div class='w2ui-field' style='margin-left: 0px;'><label>Update results:</label><br>" +
	"<div style='margin-left: 5px;'><textarea name='resultsLeftTextarea' type='text' style='width: 100%; height: 150px;' rows=100 cols=10></textarea></div></div>" +
	"</div>" + 
	"<div class='w2ui-buttons'>" +
        "<button class='w2ui-btn' name='clear'><i class='fa fa-trash' aria-hidden='true'></i>&nbsp;Clear</button>" +
	"</div></div>"

    // results left layout
    $("#resultSectionLeft").w2form({
        name  : 'resultsLeftForm',
	formHTML: resultsLeftHtmlForm,
	style: "margin: 5px;",
        fields: [
    	    { field: 'resultsLeftTextarea', type: 'text' },
        ],
        actions: {
	    clear: function(event){
		$('#resultsLeftTextarea').val("");
	    }
	}
    });

    // html code for right results form
    resultsRightHtmlForm = "<div id='resultsRightForm' style='width: 100%;'>" +
	"<div class='w2ui-page page-0'>" +
	"<div class='w2ui-field' style='margin-left: 0px;'><label>Query results:</label><br>" +
 	"<div style='margin-left: 5px;'><textarea name='resultsQRightTextarea' type='text' style='width: 100%; height: 150px;' rows=100 cols=10></textarea></div></div><br>" +
        "<div class='w2ui-field' style='margin-left: 0px;'><label>Subscriptions:</label><br>" +
 	"<div style='margin-left: 5px;'><textarea name='resultsSRightTextarea' type='text' style='width: 100%; height: 150px;' rows=100 cols=10></textarea></div></div>" +
	"</div>" + 
	"<div class='w2ui-buttons'>" +
        "<button class='w2ui-btn' name='clearQ'><i class='fa fa-trash' aria-hidden='true'></i>&nbsp;Clear Query Results</button>" +
	"<button class='w2ui-btn' name='clearS'><i class='fa fa-trash' aria-hidden='true'></i>&nbsp;Clear Subscription Panel</button>" +
	"</div></div>"

    // results left layout
    $("#resultSectionRight").w2form({
        name  : 'resultsRightForm',
	formHTML: resultsRightHtmlForm,
	style: "margin: 5px;",
        fields: [
	    { field: 'resultsQRightTextarea', type: 'text' },
    	    { field: 'resultsSRightTextarea', type: 'text' },
        ],
        actions: {
	    clearS: function(event){
		$('#resultsSRightTextarea').val("");
	    },
	    clearQ: function(event){
		$('#resultsQRightTextarea').val("");
	    }
	}
    });
    
    
});
