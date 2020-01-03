$(function() {
    $('body').append('<div id="messageBox" title="Info"><p><span class="ui-icon ui-icon-info" style="float:left; margin:0 7px 50px 0;"></span><span id="messageBoxMessage" >Message Box Error Message Goes Here</span></p></div>');
    $("#messageBox").dialog({
        modal: true,
        resizable: false,
        autoOpen: false,
        buttons: {
	        OK: function() {
		        $( this ).dialog( "close" );
	        }
        }
    });
});

function messageBox(message) {
    $("#messageBoxMessage").html(message);
    $( "#messageBox" ).dialog('open');
	document.getElementsByClassName('ui-button-icon ui-icon ui-icon-closethick')[0].style.visibility = 'hidden';
}
   