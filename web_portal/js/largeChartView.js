var cycleData = {};

$().ready(function() {
	$('#placeholder').css('height', $(window).height() - 220 + "px");
	$('#placeholder').css('width', $(window).width() - 40 + "px");
	getCycleData(getCycle());
});

$(window).resize(function() {
	$('#placeholder').css('height', $(window).height() - 220 + "px");
	$('#placeholder').css('width', $(window).width() - 40 + "px");
	onCycleDataSuccess(cycleData);
});

function setCycleStatus(status) {
	$('#cycleStatus').html(status);
}

function setCycleDate(date) {
	if (date)
		$('#cycleDate').html(' Date: ' + date);
	else
		$('#cycleDate').html('');
}

function getCycle() {
	var args = window.location.search.split('&');
	var cycle = {
		"year" : args[0].substring(1), // remove the first '?'
		"month" : args[1],
		"day" : args[2],
		"cycle" : args[3]
	};
	return cycle;
}

function getCycleData(cycle) {
	$.ajax({
		url : 'data/cycleData.cgi?' + (new Date()).getTime(),
		// type: 'GET',
		type : 'POST',
		dataType : 'json',
		data : JSON.stringify(cycle),
		success : onCycleDataSuccess,
		error : function(xhr, textStatus, errorThrown) {
			messageBox(trStrings.postErrors.cycleData + xhr.status + ' '
					+ textStatus);
		}
	});
}

// then fetch the data with jQuery
function onCycleDataSuccess(series) {
	if (typeof (series.succeeded) != 'undefined' && series.succeeded == true) {
		cycleData = series;
		setCycleStatus(series.status);
		setCycleDate(series.date);
		drawChart(cycleData);
	} else {
		messageBox(trStrings.dataErrors.cycleData);
	}
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
	};

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
				return "";
			}
		},
		legend : {
			position : "nw"
		},
		yaxis : {
			tickFormatter : function(v, axis) {
				return v.toFixed(axis.tickDecimals);
			},
			min : 0,
			max : 150
		},
		y2axis : {
			tickFormatter : function(v, axis) {
				return v.toFixed(axis.tickDecimals);
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

	$.plot($('#placeholder'), data, options);
}
