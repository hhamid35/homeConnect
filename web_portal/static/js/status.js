var statusScreenRefreshTimer;
var statusScreenRefreshPending = 0;
var statusScreenRefreshTimeout = 10;
var sARCHIVE = 0;
var sRUNNING = 1;
var sSTOPPED_CASSETTE_IN = 2;
var sSTOPPED_CASSETTE_OUT = 3;
var runmode = 0;

var placeholder = $("#placeholder");

var cycleData = {
	runmode : "",
	temp : "",
	pressure : "",
	x_axis_points : 0,
	display_units : "",
};

$(function() {
	clear();
});

function setCycleStatus(status) {
	// parent.document.getElementById('cycleStatus').innerHTML = status;
	$('#cycleStatus').html(status);
}

function setCycleDate(date) {
	if (date)
		// parent.document.getElementById('cycleDate').innerHTML = ' Date:
		// '+date;
		$('#cycleDate').html(date);
	else
		// parent.document.getElementById('cycleDate').innerHTML = '';;
		$('#cycleDate').html('');
}

function setCycleLog(log) {
	// parent.document.getElementById('printout').innerHTML =
	// log.replace(/\n/g,"<BR />").replace(/\r/g,"");
	$('#printout').html(log.replace(/\n/g, "<BR />").replace(/\r/g, ""));
	/*
	 * var height = document.body.scrollHeight; if(parent.resetHeight)
	 * parent.resetHeight(height+10+'px');
	 */
}

function clear() {
	$('#placeholder').html("");
	setCycleStatus("");
	setCycleDate("");
	setCycleLog("");
}

function setPrintPreviewLink(link) {
	$("#dialog-confirm").dialog(
			{
				resizable : false,
				height : 140,
				autoOpen : false,
				modal : true,
				buttons : {
					"Print Preview" : function() {
						// replace query string here with data from this cycle
						window.open('printPreview.html?' + link, '_blank',
								'scrollbars=yes, resizable=yes');
					},
					Cancel : function() {
						$(this).dialog("close");
					}
				}
			});
}

function drawChart(series) {
	var temperature = jQuery.trim(series.temp);
	temperature = temperature.split(" ");
	var temp = new Array(temperature.length);

	if (series.display_units === 'imperial') {
		for (var i = 0; i < temperature.length; i++)
			temp[i] = new Array(i, Number(temperature[i]) * 9 / 5 + 32);
	} else {
		for (var i = 0; i < temperature.length; i++)
			temp[i] = new Array(i, Number(temperature[i]));
	}
	var tempSeries = {
		label : injectStrings.temperature,
		data : temp
	};

	var pressure = jQuery.trim(series.pressure);
	pressure = pressure.split(" ");
	temp = new Array(pressure.length);

	if (series.display_units === 'imperial') {
		for (var i = 0; i < pressure.length; i++)
			temp[i] = new Array(i, Number(pressure[i]) * 0.14503773773020923);
	} else {
		for (var i = 0; i < pressure.length; i++)
			temp[i] = new Array(i, Number(pressure[i]));
	}
	var pressureSeries = {
		label : injectStrings.pressure,
		data : temp,
		yaxis : 2
	}

	data = [];
	data.push(tempSeries);
	data.push(pressureSeries);

	var options = {
		lines : {
			show : true
		},
		points : {
			show : false
		},
		xaxis : {
			tickDecimals : 0,
			tickSize : 1,
			tickFormatter : function(v, axis) {
				return ""
			}
		},
		legend : {
			position : "nw"
		},
		yaxis : {
			tickFormatter : function(v, axis) {
				return v.toFixed(axis.tickDecimals)
			},
			min : 0,
			max : 150
		},
		y2axis : {
			tickFormatter : function(v, axis) {
				return v.toFixed(axis.tickDecimals)
			},
			min : 0,
			max : 390
		}
	};

	if (series.display_units === 'imperial') {
		options.yaxis.tickFormatter = function(v, axis) {
			return v.toFixed(axis.tickDecimals) + "&deg;F";
		};
		options.y2axis.tickFormatter = function(v, axis) {
			return v.toFixed(axis.tickDecimals) + "psi";
		}
	} else {
		options.yaxis.tickFormatter = function(v, axis) {
			return v.toFixed(axis.tickDecimals) + "&deg;C";
		};
		options.y2axis.tickFormatter = function(v, axis) {
			return v.toFixed(axis.tickDecimals) + "kPa";
		}
	}

	$('#placeholder').html('');
	$.plot($('#placeholder'), data, options);
}

function initializeStatusTimer() {
	statusScreenRefreshTimer = setInterval(periodicStatusTimer, 1000);
}
function periodicStatusTimer() {
	var options = {};
	var objImage = document.getElementById("logoImage");

	if (statusScreenRefreshTimeout > 0)
		statusScreenRefreshTimeout--;

	if (statusScreenRefreshPending == 1 && statusScreenRefreshTimeout > 0) {
		return;
	}

	statusScreenRefreshPending = 1;
	if (objImage.complete == true || statusScreenRefreshTimeout == 0) {
		options.lastCount = cycleData.x_axis_points;
		$
				.ajax({
					url : 'data/status.cgi?' + (new Date()).getTime(),
					type : 'POST',
					// must be POST on server
					// type: 'GET',
					dataType : 'json',
					data : JSON.stringify(options),
					// data: {"x_axis_points": new Number(numAxisPoints)},
					success : function(data) {
						statusScreenRefreshPending = 0;
						if (typeof (data.succeeded) != 'undefined'
								&& data.succeeded) {
							setCycleStatus(data.status);
							setCycleDate(data.date);
							setCycleLog(data.log);

							// check current runmode to determine what to do
							if (data.runmode == sRUNNING) {
								if (runmode != sRUNNING) {
									cycleData.temp = "";
									cycleData.pressure = "";
									cycleData.x_axis_points = 0;
								}
								cycleData.temp = cycleData.temp + data.temp;
								cycleData.pressure = cycleData.pressure
										+ data.pressure;
								cycleData.x_axis_points += data.x_axis_points;
								cycleData.display_units = data.display_units;
								cycleData.runmode = data.runmode;
								runmode = data.runmode;
								drawChart(cycleData);
							} else if (data.runmode == sSTOPPED_CASSETTE_IN) {
								if (runmode == sRUNNING) { // prevents dialog
															// from continually
															// popping up
									cycleData.temp = cycleData.temp + " "
											+ data.temp + " ";
									cycleData.pressure = cycleData.pressure
											+ " " + data.pressure + " ";
									cycleData.x_axis_points += data.x_axis_points;
									cycleData.display_units = data.display_units;
									cycleData.runmode = data.runmode;
									runmode = data.runmode;
									drawChart(cycleData);
									setPrintPreviewLink(data.cycleID.year + '&'
											+ data.cycleID.month + '&'
											+ data.cycleID.day + '&'
											+ data.cycleID.cycle);
									$('#dialog-confirm').dialog('open');
								} else { // we were already stopped. do
											// nothing.
									runmode = data.runmode;
								}
							} else if (data.runmode == sSTOPPED_CASSETTE_OUT) {
								cycleData.x_axis_points = 0;
								if (runmode == sSTOPPED_CASSETTE_IN) {
									$('#dialog-confirm').dialog('close');
								}
								runmode = data.runmode;
								// $('#chart').css('visibility','hidden');
								$('#placeholder').html('');
							} else if (data.runmode == sARCHIVE) {
								drawChart(data);
							}
						}
					},
					error : function(xhr, textStatus, errorThrown) {
						statusScreenRefreshPending = 0;
						messageBox(trStrings.postErrors.status + xhr.status
								+ ' ' + textStatus);
					}
				});
		statusScreenRefreshTimeout = 20;
	}
}
