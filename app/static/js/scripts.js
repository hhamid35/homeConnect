function getDeviceInfoSuccess(data) {
    document.getElementById("selectedDevice").innerHTML = " ";
    document.getElementById("selectedDevice").innerHTML += "<div id='deviceInfo'>";
    document.getElementById("selectedDevice").innerHTML += "<p><b>Device Name: </b><span id='deviceName'>" + data.name + "</span></p>";
    document.getElementById("selectedDevice").innerHTML += "<p><b>Device IP Address: </b><span id='deviceIP'>" + data.ip_address + "</span></p>";
    document.getElementById("selectedDevice").innerHTML += "<p><b>Device Status: </b><span id='deviceStatus'>" + data.status + "</span></p>";
    document.getElementById("selectedDevice").innerHTML += "<p><b>Device Type: </b><span id='deviceType'>" + data.device_type + "</span></p></div>";
    if ("unregistered".localeCompare(data.status) == 0) {
        document.getElementById("selectedDevice").innerHTML += "<div id='deviceAction'><form id='registerForm' action='/registerDevice' method='POST'>";
        document.getElementById("selectedDevice").innerHTML += "<label>Topic:</label>";
        document.getElementById("selectedDevice").innerHTML += "<input type='text' name='topic'><br>";
        document.getElementById("selectedDevice").innerHTML += "<input type='submit' value='Register'>";
        document.getElementById("selectedDevice").innerHTML += "</form></div>";

    }
    else {
        document.getElementById("selectedDevice").innerHTML += "<div id='deviceAction'>";
        document.getElementById("selectedDevice").innerHTML += "<input type='button' value='Unregister' onClick='unregister()'>";
        document.getElementById("selectedDevice").innerHTML += "</div>";
    }
}


function getDeviceInfo() {
    $.ajax({
        url: "/getDeviceInfo",
        method: "GET",
        dataType: "json",
        success: getDeviceInfoSuccess,
        error: function(xhr, textStatus, errorThrown) {
           document.getElementById("devicesDiscovery").innerHTML = "<br><br><span>Please Try Again In A Few Moments</span><br><br>";
        }
     });
}


function deviceButtonClick() {
    document.getElementById("selectedDevice").innerHTML = "<br><br><br><br><img src='/static/images/ajax-loader.gif' width='40' height='40'/><br><br>";
    getDeviceInfo();
}

function getDevicesSuccess(data) {
    document.getElementById("devicesDiscovery").innerHTML = " ";
    for(var i=0;i<data.length;i++) {
        document.getElementById("devicesDiscovery").innerHTML += "<br><br><input type='button' value='" + data[i].name + " - " + data[i].ip_address + "' onclick='deviceButtonClick()'><br><br>";
        if( i == data.length - 1 ) {
            document.getElementById("devicesDiscovery").innerHTML += "<br>";
        }
    }
}

function getDevices() {
    $.ajax({
        url: "/getDevices",
        method: "GET",
        dataType: "json",
        success: getDevicesSuccess,
        error: function(xhr, textStatus, errorThrown) {
           document.getElementById("devicesDiscovery").innerHTML = "<br><br><span>Please Try Again In A Few Moments</span><br><br>";
        }
     });
}

function refresh() {
    document.getElementById("selectedDevice").innerHTML = " ";
    document.getElementById("devicesDiscovery").innerHTML = "<br><br><br><br><img src='/static/images/ajax-loader.gif' width='40' height='40'/><br><br>";
    getDevices();
}