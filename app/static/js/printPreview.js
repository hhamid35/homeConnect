$(function() {
	function getContacts() {
		$
				.ajax({
					url : 'data/contacts.cgi',
					method : 'GET',
					dataType : 'json',
					success : function(data) {
						// contact info
						$('#officeName').html(data.officeName);
						if (data.officePhone != "")
							$('#officePhone').append(data.officePhone);
						else
							$('#officePhone').html("");
						if (data.officeFax != "")
							$('#officeFax').append(data.officeFax);
						else
							$('#officeFax').html("");
						$('#officeAddress1').html(data.officeAddress1);
						$('#officeAddress2').html(data.officeAddress2);

						$('#regionBlob').html("");
						if (data.zip != "") {
							if (data.city != "" || data.state != "") {
								if (data.city != ""
										&& data.state != ""
										&& shouldHideStateOrProvince(data.country) == false)
									$('#regionBlob').html(
											data.city + ", " + data.state + " "
													+ data.zip);
								else if (data.city != "")
									$('#regionBlob').html(
											data.city + " " + data.zip);
								else if (data.state != ""
										&& shouldHideStateOrProvince(data.country) == false)
									$('#regionBlob').html(
											data.state + " " + data.zip);
							} else {
								$('#regionBlob').html(data.zip);
							}
						} else {
							if (data.city != ""
									&& data.state != ""
									&& shouldHideStateOrProvince(data.country) == false)
								$('#regionBlob').html(
										data.city + ", " + data.state);
							else if (data.city != "")
								$('#regionBlob').html(data.city);
							else if (data.state != ""
									&& shouldHideStateOrProvince(data.country) == false)
								$('#regionBlob').html(data.state);
						}

						$('#logo').attr('src', data.logoURL);

						// Unit info
						$('#unitType').html(data.unitType);
						$('#serial').html(data.serialNum);
					},
					error : function(xhr, textStatus, errorThrown) {
						messageBox(trStrings.postErrors.contacts + xhr.status
								+ ' ' + textStatus);
					}
				});
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
		if (typeof (series.succeeded) != 'undefined'
				&& series.succeeded == true) {
			var cycleData = series;
			setCycleStatus(series.status);
			setCycleDate(series.date);
			setCycleLog(series.log);
			drawChart(cycleData);
			document.getElementById("emailBtn").style.display = "block";
			document.getElementById("printBtn").style.display = "block";

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
					return "";
				}
			},
			legend : {
				position : "se"
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

	function setCycleStatus(status) {
		// parent.document.getElementById('cycleStatus').innerHTML = status;
		$('#cycleStatus').html(status);
	}

	function setCycleDate(date) {
		if (date)
			// parent.document.getElementById('cycleDate').innerHTML = ' Date:
			// '+date;
			$('#cycleDate').html(' Date: ' + date);
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

	function submitResult(data, successStr, errorStr) {
		if (typeof (data.succeeded) != 'undefined' && data.succeeded == true) {
			messageBox(successStr);
			return true;
		} else {
			if (typeof (data.error) != 'undefined')
				errorStr += "\n\n" + data.error;
			messageBox(errorStr);
			return false;
		}
	}

	function sendEmail() {
		var cycle = getCycle();
		$.ajax({
			url : 'data/email.cgi?' + (new Date()).getTime(),
			type : 'POST',
			dataType : 'json',
			data : JSON.stringify(cycle),
			success : function(data) {
				submitResult(data, trStrings.success.email,
						trStrings.dataErrors.email);
			},
			error : function(xhr, textStatus, errorThrown) {
				messageBox(trStrings.postErrors.email + xhr.status + ' '
						+ textStatus);
			}
		});
	}

	function print() {
		window.print();
	}

	$().ready(function() {
		$('#emailBtn').click(sendEmail);
		$('#printBtn').click(print);
		getContacts();
		getCycleData(getCycle());
	});

});