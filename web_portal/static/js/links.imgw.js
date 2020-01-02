var id_to_src = [
		['ticker_top_grey', 'https://updates.scican.com/library/G4/Bravo/100/images/ticker_top_grey.gif'],
		['ticker_btm_grey', 'https://updates.scican.com/library/G4/Bravo/100/images/ticker_btm_grey.gif'],
		['linkScicanImg', 'https://updates.scican.com/library/G4/Bravo/100/images/sci_48.jpg'],
		['linkWarrantyImg', 'https://updates.scican.com/library/G4/Bravo/100/images/war_48.jpg'],
		['linkTVImg', 'https://updates.scican.com/library/G4/Bravo/100/images/tv_48.jpg'],
		['logoImage', 'https://updates.scican.com/library/G4/Bravo/100/images/scican.png'],
		['icon_ff', 'https://updates.scican.com/library/G4/Bravo/100/images/icon_ff.png'],
		['icon_safari4', 'https://updates.scican.com/library/G4/Bravo/100/images/icon_safari4.png'],
		['icon_chrome', 'https://updates.scican.com/library/G4/Bravo/100/images/icon_chrome.png'],
		['icon_ie8', 'https://updates.scican.com/library/G4/Bravo/100/images/icon_ie8.png'],
		['statimImage', 'https://updates.scican.com/library/G4/Bravo/100/images/statimImage.jpg'],
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
	$('#ticker-middle-grey').css('background-image', 'url(https://updates.scican.com/library/G4/Bravo/100/images/ticker_middle_grey.gif)');
	$('#ticker-middle-grey').css('background-repeat', 'repeat-y');
	
	if( $('#ticker-top-grey-back').length ) {
		$('#ticker-top-grey-back').css('background-image', 'url(https://updates.scican.com/library/G4/Bravo/100/images/ticker_top_grey.gif)');
		$('#ticker-top-grey-back').css('height', '5px');
	}
}

$(function() {
	updateImgLinks();
	updateTickerMiddleGrey();
});
