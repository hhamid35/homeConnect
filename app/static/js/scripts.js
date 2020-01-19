function deviceActionSuccess(data) {
    console.log(data);
}

function deviceAction(device, action_type, pin_num, change_to) {
    var payload = {
        ip_address: device.name,
        action: action_type,
        pin: pin_num,
    }

    if ( "switch".localCompare(device.payload.device_type) == 0 ) {
        payload.add(state, change_to);
    }
    else {
        payload.add(value, change_to);
    }

    $.ajax({
        url: "/deviceAction",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: deviceActionSuccess,
        error: function(xhr, textStatus, errorThrown) {
           document.getElementById("selectedDevice").innerHTML = "<br><br><span>Please Try Again In A Few Moments</span><br><br>";
        }
    });
}

function unregisterDeviceSuccess(data){
    if ("success".localeCompare(data.status) == 0) {
        getDeviceInfo($("#deviceIP").html());
    }
    else {
        alert("Error Registering Device.");
        getDeviceInfo($("#deviceIP").html());
    }
}

function unregisterDevice(){
    var payload = {
        ip_address: $("#deviceIP").html()
    }
    document.getElementById("selectedDevice").innerHTML = "<br><br><br><br><img src='/static/images/ajax-loader.gif' width='40' height='40'/><br><br>";
    $.ajax({
        url: "/unregisterDevice",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: unregisterDeviceSuccess,
        error: function(xhr, textStatus, errorThrown) {
           document.getElementById("selectedDevice").innerHTML = "<br><br><span>Please Try Again In A Few Moments</span><br><br>";
        }
    });
}

function unregisterDeviceButtonClick() {
    unregisterDevice();
}

function registerDeviceSuccess(data) {
    if ("success".localeCompare(data.status) == 0) {
        getDeviceInfo($("#deviceIP").html());
    }
    else {
        alert("Error Registering Device.");
        getDeviceInfo($("#deviceIP").html())
    }
}

function registerDevice() {
    var payload = {
        ip_address: $("#deviceIP").html(),
        name: $("#deviceName").val()
    }
    console.log(payload);
    document.getElementById("selectedDevice").innerHTML = "<br><br><br><br><img src='/static/images/ajax-loader.gif' width='40' height='40'/><br><br>";
    $.ajax({
        url: "/registerDevice",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: registerDeviceSuccess,
        error: function(xhr, textStatus, errorThrown) {
           document.getElementById("selectedDevice").innerHTML = "<br><br><span>Please Try Again In A Few Moments</span><br><br>";
        }
    });
}

function registerDeviceButtonClick() {
    registerDevice();
}

function getDeviceInfoSuccess(data) {
    document.getElementById("selectedDevice").innerHTML = " ";
    document.getElementById("selectedDevice").innerHTML += "<div id='deviceInfo'>";
    document.getElementById("selectedDevice").innerHTML += "<p><b>Board Name: </b><span id='boardName'>" + data.payload.board_name + "</span></p>";
    document.getElementById("selectedDevice").innerHTML += "<p><b>Device IP Address: </b><span id='deviceIP'>" + data.payload.ip_address + "</span></p>";
    document.getElementById("selectedDevice").innerHTML += "<p><b>Device Status: </b><span id='deviceStatus'>" + data.status + "</span></p>";
    document.getElementById("selectedDevice").innerHTML += "<p><b>Device Type: </b><span id='deviceType'>" + data.payload.device_type + "</span></p></div>";
    if ("unregistered".localeCompare(data.status) == 0) {
        document.getElementById("selectedDevice").innerHTML += "<div id='deviceAction'><label>Topic:</label><input type='text' placeholder='Type something...' id='deviceName'><br><input type='button' value='Register' onClick=registerDeviceButtonClick()></div>";
    }
    else if ("registered".localeCompare(data.status) == 0) {
        document.getElementById("selectedDevice").innerHTML += "<p><b>Device Registered As: </b><span id='deviceType'>" + data.name + "</span></p></div>";
        document.getElementById("selectedDevice").innerHTML += "<div id='deviceAction'><input type='button' value='Unregister' onClick='unregisterDeviceButtonClick()'></div>";
    }
    else {
        document.getElementById("selectedDevice").innerHTML = "<p><b>Error Getting Device Information.</b></p> ";
        document.getElementById("selectedDevice").innerHTML += "<p><b>Check If Device Is Still On the Network.</b></p> ";
    }
}


function getDeviceInfo(device_ip) {
    var payload = {
        ip_address: device_ip
    }
    $.ajax({
        url: "/getDeviceInfo",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: getDeviceInfoSuccess,
        error: function(xhr, textStatus, errorThrown) {
           document.getElementById("selectedDevice").innerHTML = "<br><br><span>Please Try Again In A Few Moments</span><br><br>";
        }
     });
}


function deviceButtonClick(device_ip) {
    document.getElementById("selectedDevice").innerHTML = "<br><br><br><br><img src='/static/images/ajax-loader.gif' width='40' height='40'/><br><br>";
    getDeviceInfo(device_ip);
}

function getDevicesSuccess(data) {
    document.getElementById("devicesDiscovery").innerHTML = " ";
    for ( var i=0; i<data.length; i++ ) {
        document.getElementById("devicesDiscovery").innerHTML += "<br><br><input type='button' value='" + data[i].payload.board_name + " - " + data[i].ip_address + "' name='" + data[i].ip_address + "' onclick='deviceButtonClick(this.name)'><br><br>";
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