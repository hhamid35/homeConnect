var id_to_src = [
		['ticker_top_grey', 'images/ticker_top_grey.gif'],
		['ticker_btm_grey', 'images/ticker_btm_grey.gif'],
		['linkScicanImg', 'images/sci_48.jpg'],
		['linkWarrantyImg', 'images/war_48.jpg'],
		['linkTVImg', 'images/tv_48.jpg'],
		['logoImage', 'images/scican.png'],
		['icon_ff', 'images/icon_ff.png'],
		['icon_safari4', 'images/icon_safari4.png'],
		['icon_chrome', 'images/icon_chrome.png'],
		['icon_ie8', 'images/icon_ie8.png'],
		['statimImage', 'images/statimImage.jpg'],
];

function updateImgLinks()
{
    for(var i = 0; i < id_to_src.length; i++) {
        if( 2 === id_to_src[i].length ) {
        	var img_id;
        	img_id = document.getElementById(id_to_src[i][0]);
        	if(img_id !== null)
        		img_id.src = id_to_src[i][1];
        }
    }
}

function updateTickerMiddleGrey() {
	$('#ticker-middle-grey').css('background-image', 'url(images/ticker_middle_grey.gif)');
	$('#ticker-middle-grey').css('background-repeat', 'repeat-y');
	
	if( $('#ticker-top-grey-back').length ) {
		$('#ticker-top-grey-back').css('background-image', 'url(images/ticker_top_grey.gif)');
		$('#ticker-top-grey-back').css('height', '5px');
	}
}

$(function() {
	updateImgLinks();
	updateTickerMiddleGrey();
});
