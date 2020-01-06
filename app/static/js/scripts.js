function getDeviceInfoSuccess(data) {
    document.getElementById("deviceInfo").innerHTML = " ";
    document.getElementById("deviceInfo").innerHTML += "<p><b>Device Name: </b><span>" + data.name + "</span></p>";
    document.getElementById("deviceInfo").innerHTML += "<p><b>Device IP Address: </b><span>" + data.ip_address + "</span></p>";
    document.getElementById("deviceInfo").innerHTML += "<p><b>Device Status: </b><span>" + data.status + "</span></p>";
    document.getElementById("deviceInfo").innerHTML += "<p><b>Device Type: </b><span>" + data.device_type + "</span></p>";
    if ("unregistered".localeCompare(data.status) == 0) {
        document.getElementById("deviceInfo").innerHTML += "<form action='registerDevice' method='POST'>";
        document.getElementById("deviceInfo").innerHTML += "<label>Topic:</label>";
        document.getElementById("deviceInfo").innerHTML += "<input type='text' name='topic'><br>";
        document.getElementById("deviceInfo").innerHTML += "<input type='submit' value='Register'>";
        document.getElementById("deviceInfo").innerHTML += "</form>";

    }
    else {
        document.getElementById("deviceInfo").innerHTML += "<input type='button' value='Unregister' onClick='unregister()'>";
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
    document.getElementById("deviceInfo").innerHTML = "<br><br><br><br><img src='/static/images/ajax-loader.gif' width='40' height='40'/><br><br>";
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
    document.getElementById("deviceInfo").innerHTML = " ";
    document.getElementById("devicesDiscovery").innerHTML = "<br><br><br><br><img src='/static/images/ajax-loader.gif' width='40' height='40'/><br><br>";
    getDevices();
}