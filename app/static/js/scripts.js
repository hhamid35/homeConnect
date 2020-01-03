function getDevicesSuccess(data) {
    document.getElementById("devicesDiscovery").innerHTML = " ";
    for(var i=0;i<data.length;i++) {
        document.getElementById("devicesDiscovery").innerHTML += "<br><br><input type='button' value='" + data[i].name + "' onclick='getDeviceInfo()'><br><br>";
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
    document.getElementById("devicesDiscovery").innerHTML = "<br><br><br><br><img src='/static/images/ajax-loader.gif' width='40' height='40'/><br><br>";
    getDevices();
}