var pulseSeconds;
var imageFetchTimeout = 10;
var _im = null;
var firstPictureLoaded = false;

$().ready(function() {

	$('#ip').text(window.location.hostname);

	$(document).bind('imageRequestTimedOut', function(){
		if( imageFetchTimeout == 0 ){
			imageFetchTimeout = 10;

			if( _im != null )
				_im.remove();

			loadImage();
		}
	});

	$('#screen-wrap').bind('click', function(e) {
		if( firstPictureLoaded == true ) {
			var offset = $(this).offset();
			var x = e.pageX - offset.left;
			var y = e.pageY - offset.top;
			postXY(x,y);
		}
	});
});


function loadImage(){
	
    var _url = 'images/screen.cgi?' + new Date().getTime();
    
    _im = $("<img>");
    _im.attr('src', _url);
    
    _im.hide();

    _im.bind('load', function(){
    	imageFetchTimeout = 10;
    	
    	$(this).show();
        $('#screen').replaceWith($(this)).remove();
        $(this).attr('id', 'screen');
        
        firstPictureLoaded = true;
    	
        setTimeout(loadImage , 1000);
    });
    
//    _im.bind('click', function(e){
//        var offset = $(this).offset();
//        var x = e.pageX - offset.left;
//        var y = e.pageY - offset.top;
//        postXY(x,y);
//    });
    
}

function remoteIntervalEvent(){
	
	if( imageFetchTimeout == 0 )
		$(document).trigger('imageRequestTimedOut');
	
	if( imageFetchTimeout > 0 )
		imageFetchTimeout--;
}

function initializeRemoteTimer(){
	
	loadImage();
	
	pulseSeconds = setInterval(remoteIntervalEvent, 1000);
}


function postXY(x,y) {
    options = {
        "x": x,
        "y": y
    };
    $.ajax({
      url: 'data/remoteControl.cgi?' + (new Date()).getTime(),
      type: 'POST',
      // must be POST on server
      // type: 'GET',
      dataType: 'json',
      data: JSON.stringify(options),
      error: function (xhr, textStatus, errorThrown) { 
         messageBox(trStrings.postErrors.remote + xhr.status + ' '+textStatus);
      } 
   });
}
