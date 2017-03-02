$(function(){

    var toolbarStyle = 'radius: 10px; padding: 5px;';

    // toolbar
    $('#topToolbarSection').w2toolbar({
	name: 'topToolbar',
	items: [
	    { type: 'html',  id: 'httpLabel',  html: 'HTTP host:&nbsp;' },
	    { type: 'html', id: 'httpEntry', html: '<input type="text" name="httphost">' },
	    { type: 'break' },
	    { type: 'html',  id: 'wsLabel',  html: 'WebSocket host:&nbsp;' },
	    { type: 'html', id: 'wsEntry', html: '<input type="text" name="wshost">' },
	    { type: 'break' },
	    { type: 'button', id: 'connectButton', text: 'Connect/Disconnect'},
	    { type: 'button', id: 'loadSapButton', text: 'Load SAP file'}
	]
    });    

    // namespaces section
    $('#namespacesSection').w2layout({
        name: 'nsLayout',
	style: toolbarStyle,
        panels: [
            { type: 'left', size: '50%', content: 'left', style: 'margin: 5px; margin-top: 0px; margin-left: 0px;' },
            { type: 'right', size: '50%', content: 'right', style: 'margin: 5px; margin-top: 0px; margin-right: 0px;' },
        ]
    });
   
    // namespaces grid
    $().w2grid({	
	name: 'nsGrid',	
	columns: [
	    { field: 'prefix', caption: 'Prefix', size: '30%' },
	    { field: 'namespace', caption: 'Namespace', size: '70%' }
	]
    });
    w2ui['nsLayout'].content('left', w2ui['nsGrid']);

    // namespaces form    
    $().w2form({ 
        name  : 'nsForm',
        fields: [
    	    { field: 'Prefix', type: 'text' },
    	    { field: 'Namespace',  type: 'text' },
        ],
        actions: {
            'Add prefix': function (event) {}
        }
    });
    w2ui['nsLayout'].content('right', w2ui['nsForm']);

    // uqs section
    $('#uqsSection').w2layout({
        name: 'uqsLayout',
	style: toolbarStyle,
        panels: [
            { type: 'left', size: '50%', content: 'left', style: 'margin: 5px; margin-top: 0px; margin-left: 0px;' },
            { type: 'right', size: '50%', content: 'right', style: 'margin: 5px; margin-top: 0px; margin-right: 0px;' },	    
        ]
    });

    // update section
    $().w2layout({
        name: 'updateLayout',
	style: toolbarStyle,
        panels: [
            { type: 'left', size: '50%', content: 'left', style: 'margin: 5px; margin-top: 0px; margin-left: 0px;' },
            { type: 'right', size: '50%', content: 'right', style: 'margin: 5px; margin-top: 0px; margin-right: 0px;' },
	    { type: 'bottom', size: '50%', content: 'bottom', style: 'margin: 5px; border-style: none;' },
        ]
    });
    w2ui['uqsLayout'].content('left', w2ui['updateLayout']);

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

    // update form
    $('#uqForm').w2form({
        name  : 'uForm',
        fields: [
    	    { field: 'uqtext',  type: 'textarea', name: 'Update/query:' },
        ],
	actions: {
            'SPARQL Update': function (event)  {},
            'SPARQL Query': function (event) {}
        }
    });
    w2ui['updateLayout'].content('bottom', w2ui['uForm']);

    // subscribe section
    $().w2layout({
        name: 'subscribeLayout',
	style: toolbarStyle,
        panels: [
            { type: 'left', size: '50%', content: 'left', style: 'margin: 5px; margin-top: 0px; margin-left: 0px;' },
            { type: 'right', size: '50%', content: 'right', style: 'margin: 5px; margin-top: 0px; margin-right: 0px;' },
	    { type: 'bottom', size: '50%', content: 'bottom', style: 'margin: 5px; border-style: none' },
        ]
    });
    w2ui['uqsLayout'].content('right', w2ui['subscribeLayout']);

    // subscribe form
    $().w2form({
        name  : 'sForm',
        fields: [
    	    { field: 'stext', type: 'textarea', name: 'Subscription:' },
        ],
	actions: {
            'SPARQL Subscribe': function (event) {},
            'SPARQL Unsubscribe': function (event) {}
        }
    });
    w2ui['subscribeLayout'].content('bottom', w2ui['sForm']);


    // subscription list
    $().w2grid({	
	name: 'sGrid',	
	columns: [
	    { field: 'subscription', caption: 'SPARQL Subscription', size: '100%' },
	]
    });
    w2ui['subscribeLayout'].content('left', w2ui['sGrid']);

    // subscribe forced bindings grid
    $().w2grid({	
	name: 'sfbGrid',	
	columns: [
	    { field: 'svariable', caption: 'Variable', size: '35%' },
	    { field: 'svalue', caption: 'Value', size: '35%' },
	    { field: 'sliteral', caption: 'Literal', size: '30%' }
	]
    });
    w2ui['subscribeLayout'].content('right', w2ui['sfbGrid']);

    // bottom toolbar
    $('#bottomToolbarSection').w2toolbar({
	name: 'bottomToolbar',
	items: [
	    { type: 'button', id: 'clearButton', text: 'Clear'}
	]
    });    
    
});
