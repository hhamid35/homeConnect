var unitTimeRefreshTimer = null;
var unitTimeRefreshPending = 0;
var unitTimeRefreshTimeout = 5;

var unitTimeDstModified = false;
var unitTimeTimeOrDateModified = false;

var unitTimePrevTimeDST = false;

$(document).ready(function(){
	$('input#timeDST').live('click', function(){
		unitTimeDstModified = true;
		checkUnitTimeTimerShouldStop();
	});
	
	$('input#hours').live('focus', function(){
		unitTimeTimeOrDateModified = true;
		checkUnitTimeTimerShouldStop();
	});
	
	$('input#minutes').live('focus', function(){
		unitTimeTimeOrDateModified = true;
		checkUnitTimeTimerShouldStop();
	});
	
	$('input#seconds').live('focus', function(){
		unitTimeTimeOrDateModified = true;
		checkUnitTimeTimerShouldStop();
	});
	
	$('input#datepicker').live('focus', function(){
		unitTimeTimeOrDateModified = true;
		checkUnitTimeTimerShouldStop();
	});
});

function checkUnitTimeTimerShouldStop(){
	if( unitTimeDstModified == true && unitTimeTimeOrDateModified == true )
		disableUnitTimeTimer();
}

function initializeUnitTimeTimer() {
	if (unitTimeRefreshTimer == null)
		unitTimeRefreshTimer = setInterval(periodicUnitTimeTimer, 2000);
	
	unitTimeDstModified = false;
	unitTimeTimeOrDateModified = false;
}
function periodicUnitTimeTimer() {
	var options = {};

	if (unitTimeRefreshTimeout > 0)
		unitTimeRefreshTimeout--;

	if (unitTimeRefreshPending == 1 && unitTimeRefreshTimeout > 0)
		return;

	if (unitTimeRefreshPending == 0) {
		
		unitTimeRefreshPending = 1;
		unitTimeRefreshTimeout = 5;
		
		$.ajax({
			url : 'data/unitTime.cgi?' + (new Date()).getTime(),
			type : 'POST',
			// must be POST on server
			// type: 'GET',
			dataType : 'json',
			data : JSON.stringify(options),
			// data: {"x_axis_points": new Number(numAxisPoints)},
			success : function(data) {
				unitTimeRefreshPending = 0;
				if (typeof(data) != 'undefined' && data != null && typeof(data.succeeded) != 'undefined' && data.succeeded == true ) {
					
					if( unitTimeTimeOrDateModified == false ) {
						$('input#hours').val(data.hours);
						$('input#minutes').val(data.minutes);
						$('input#seconds').val(data.seconds);
						$('input#datepicker').val(data.datepicker);
					}

					if( unitTimeDstModified == false ) {
						if( unitTimePrevTimeDST != data.timeDST ) {
							unitTimePrevTimeDST = data.timeDST;
							if( typeof(formCleanSerial) != 'undefined' && typeof(formCleanSerial['time']) != 'undefined' && formCleanSerial['time'].indexOf('timeUpdate=on') >= 0 ) {
								if( data.timeDST == true && formCleanSerial['time'].indexOf('timeDST=on') < 0 ) {
									formCleanSerial['time'] = formCleanSerial['time'] + "&timeDST=on";
								} else if( data.timeDST == false && formCleanSerial['time'].indexOf('timeDST=on') >= 0 ) {
									formCleanSerial['time'] = formCleanSerial['time'].replace('&timeDST=on','');
								}
							}
						}
						$('input#timeDST').attr('checked',data.timeDST);
					}

					if( typeof(datepicker2NoFocus) != 'undefined' && datepicker2NoFocus != null && datepicker2NoFocus == true )
						$('input#datepicker2').val(data.datepicker);
				}
			},
			error : function(xhr, textStatus, errorThrown) {
				unitTimeRefreshPending = 0;
			}
		});
	}
}

function disableUnitTimeTimer() {
	clearInterval(unitTimeRefreshTimer);
	unitTimeRefreshTimer = null;
}
