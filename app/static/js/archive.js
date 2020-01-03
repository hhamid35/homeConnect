$(function() {
	var data = [];
	var placeholder = $("#placeholder");
	var alreadyFetched = {};

	var cyclesData = {};
	var y;
	var m;
	var d;
	var c;

	function next() {
		if (c == cyclesData[y].months[m].days[d].cycles.length - 1) {
			if (d == cyclesData[y].months[m].days.length - 1) {
				if (m == cyclesData[y].months.length - 1) {
					if (y < cyclesData.length - 1) {
						y++;
						$('#yearChooser').val(y + 1);
						yearChoose();
						m = 0;
					}
				} else {
					m++;
				}
				$('#monthChooser').val(m + 1);
				monthChoose("next");
				return false;
			} else {
				d++;
			}
			$('#dayChooser').val(d + 1);
			dayChoose();
			c = 0;
		} else {
			c++;
		}
		$('#cycleChooser').val(c + 1);
		cycleChoose();
	}

	function prev() {
		if (c == 0) {
			if (d == 0) {
				if (m == 0) {
					if (y > 0) {
						y--;
						$('#yearChooser').val(y + 1);
						yearChoose();
						m = cyclesData[y].months.length - 1;
						if (m < 0)
							m = 0;
					}
				} else {
					m--;
				}
				$('#monthChooser').val(m + 1);
				monthChoose("prev");
				return false;
				d = cyclesData[y].months[m].days.length - 1;
				if (d < 0)
					d = 0;
			} else {
				d--;
			}
			$('#dayChooser').val(d + 1);
			dayChoose();

			c = cyclesData[y].months[m].days[d].cycles.length - 1;
			if (c < 0)
				c = 0;
		} else {
			c--;
		}
		$('#cycleChooser').val(c + 1);
		cycleChoose();
	}

	function yearChoose() {
		var year = $('#yearChooser option:selected').val();
		y = year - 1;
		populateMonths();
		clear();
		$('#printPreview').html('');
		$('#chartLink').removeAttr('href');
	}

	function monthChoose(caller) {
		var year = $('#yearChooser option:selected').text();
		var month = $('#monthChooser option:selected').text();
		var monthIndex = $('#monthChooser option:selected').val();
		m = monthIndex - 1;
		// AJAX request for info for this month if no contents exist in this
		// month
		// if(typeof(cyclesData[y].months[m]) == "undefined") {
		options = {
			"year" : year,
			"month" : month
		};
		$.ajax({
			url : 'data/cycles.cgi?' + (new Date()).getTime(),
			type : 'POST',
			dataType : 'json',
			data : JSON.stringify(options),
			success : function(data) {
				cyclesData[y].months[m] = data[0].months[0];
				populateDays();
				// we need to automatically choose the next or previous cycle if
				// this call came from a next or prev button...
				if (caller == "next") {
					d = 0;
					c = 0;
					$('#dayChooser').val(d + 1);
					// dayChoose();
					populateCycles();
					$('#cycleChooser').val(c + 1);
					cycleChoose();
				} else if (caller == "prev") {
					d = cyclesData[y].months[m].days.length - 1;
					c = cyclesData[y].months[m].days[d].cycles.length - 1;
					$('#dayChooser').val(d + 1);
					// dayChoose();
					populateCycles();
					$('#cycleChooser').val(c + 1);
					cycleChoose();
				}
			},
			error : function(xhr, textStatus, errorThrown) {
				messageBox(trStrings.postErrors.cycles + xhr.status + ' '
						+ textStatus);
			}
		});
		// }
		clear();
		$('#printPreview').html('');
		$('#chartLink').removeAttr('href');
	}

	function dayChoose() {
		var day = $('#dayChooser option:selected').val();
		d = day - 1;
		populateCycles();
		clear();
		$('#printPreview').html('');
		$('#chartLink').removeAttr('href');
	}

	function cycleChoose() {
		var cycle = $('#cycleChooser option:selected').val();
		c = cycle - 1;
		cycleChange();

		if (c == 0 && d == 0 && m == 0 && y == 0) // if we're at start,
			// disable prev
			$('#prevBtn').attr("disabled", true);
		else
			$('#prevBtn').attr("disabled", false);

		if (c == cyclesData[y].months[m].days[d].cycles.length - 1
				&& d == cyclesData[y].months[m].days.length - 1
				&& m == cyclesData[y].months.length - 1
				&& y == cyclesData.length - 1) // if we're at end, disable next
			$('#nextBtn').attr("disabled", true);
		else
			$('#nextBtn').attr("disabled", false);
	}

	function clearOptions(elSel) {
		var items = elSel.getElementsByTagName("option");
		while (items.length > 1) {
			elSel.remove(elSel.length - 1);
		}
	}

	function setCycleStatus(status) {
		$('#cycleStatus').html(status);
	}

	function setCycleDate(date) {
		if (date)
			$('#cycleDate').html(' Date: ' + date);
		else
			$('#cycleDate').html('');
	}

	function setCycleLog(log) {
		$('#printout').html(log.replace(/\n/g, "<BR />").replace(/\r/g, ""));
	}

	function clear() {
		$('#placeholder').html("");
		setCycleStatus("");
		setCycleDate("");
		setCycleLog("");
	}

	function addOption(elSel, text, value) {
		var elOptNew = document.createElement('option');
		elOptNew.text = text;
		elOptNew.value = value;
		try {
			elSel.add(elOptNew, null); // standards compliant; doesn't work in
			// IE
		} catch (ex) {
			elSel.add(elOptNew); // IE only
		}
	}
	function cycleChange() {
		yearStr = $('#yearChooser option:selected').text();
		monthStr = $('#monthChooser option:selected').text();
		dayStr = $('#dayChooser option:selected').text();
		cycleStr = $('#cycleChooser option:selected').text();
		cycle = {
			"year" : yearStr,
			"month" : monthStr,
			"day" : dayStr,
			"cycle" : cycleStr
		};

		getCycleData(cycle);
		printPreviewSetLink();
		largeChartViewSetLink();
		// print preview
		// $('#printPreview').text('Print Preview');
		// $('#printPreview').attr('href','printPreview.html?'+yearStr+'&'+monthStr+'&'+dayStr+'&'+cycleStr);
	}

	function populateYears(data) {
		clearOptions(document.getElementById('monthChooser'));
		clearOptions(document.getElementById('dayChooser'));
		clearOptions(document.getElementById('cycleChooser'));
		/*
		 * alert('Years: '+cyclesData.length+ '\nMonths:
		 * '+cyclesData[0].months.length+ '\nMonth1 Days:
		 * '+cyclesData[0].months[0].days.length+ '\nMonth1Day1 Cycles:
		 * '+cyclesData[0].months[0].days[0].cycles.length);
		 */
		for (var i = 0; i < data.length; i++) {
			addOption(document.getElementById('yearChooser'),
					cyclesData[i].year, i + 1);
		}
	}

	function populateMonths() {
		clearOptions(document.getElementById('monthChooser'));
		clearOptions(document.getElementById('dayChooser'));
		clearOptions(document.getElementById('cycleChooser'));
		for (var i = 0; i < cyclesData[y].months.length; i++) {
			addOption(document.getElementById('monthChooser'),
					cyclesData[y].months[i].month, i + 1);
		}
	}

	function populateDays() {
		clearOptions(document.getElementById('dayChooser'));
		clearOptions(document.getElementById('cycleChooser'));
		for (var i = 0; i < cyclesData[y].months[m].days.length; i++) {
			addOption(document.getElementById('dayChooser'),
					cyclesData[y].months[m].days[i].day, i + 1);
		}
	}

	function populateCycles() {
		clearOptions(document.getElementById('cycleChooser'));
		for (var i = 0; i < cyclesData[y].months[m].days[d].cycles.length; i++) {
			addOption(document.getElementById('cycleChooser'),
					cyclesData[y].months[m].days[d].cycles[i], i + 1);
		}
	}

	function writeLog(string) {
		document.getElementById('log').innerHTML = string;
	}

	function getCycleData(cycle) {
		$.ajax({
			url : 'data/cycleData.cgi?' + (new Date()).getTime(),
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
		if (typeof (series.succeeded) != 'undefined'
				&& series.succeeded == true) {
			cycleData = series;
			setCycleStatus(series.status);
			setCycleDate(series.date);
			setCycleLog(series.log);
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
				temp[i] = new Array(i,
						Number(pressure[i]) * 0.14503773773020923);
		} else {
			for (var i = 0; i < pressure.length; i++)
				temp[i] = new Array(i, Number(pressure[i]));
		}
		var pressureSeries = {
			label : injectStrings.pressure,
			data : temp,
			yaxis : 2
		};

		if (alreadyFetched[tempSeries.label]) {
			data.pop();
			alreadyFetched[tempSeries.label] = false;
		}

		if (alreadyFetched[pressureSeries.label]) {
			data.pop();
			alreadyFetched[pressureSeries.label] = false;
		}

		if (!alreadyFetched[tempSeries.label]) {
			alreadyFetched[tempSeries.label] = true;
			data.push(tempSeries);
		}
		if (!alreadyFetched[pressureSeries.label]) {
			alreadyFetched[pressureSeries.label] = true;
			data.push(pressureSeries);
		}

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

		$.plot(placeholder, data, options);
	}

	$("#yearChooser").change(yearChoose);
	$("#monthChooser").change(monthChoose);
	$("#dayChooser").change(dayChoose);
	$("#cycleChooser").change(cycleChoose);
	$("#prevBtn").click(prev);
	$("#nextBtn").click(next);

	$.ajax({
		url : 'data/cycles.cgi?' + (new Date()).getTime(),
		type : 'GET',
		dataType : 'json',
		success : function(data) {
			cyclesData = data;
			populateYears(cyclesData);
		},
		error : function(xhr, textStatus, errorThrown) {
			messageBox(trStrings.postErrors.cycles + xhr.status + ' '
					+ textStatus);
		}
	});

});
