var delayRefreshTimer = 0;

$(function() {
   $(function() {
	   $( ".button" ).button();
   });
   delayRefreshTimer = setTimeout ( "refresh()", 2000 );
});


function getUnitEnumerationSuccess(data) {
   $('#unitRegisteredEnumeration').html("");
   $('#unitsUnregisteredEnumeration').html("");
   //apply enumeration of available statim units to select dropdown
   for(var i=0;i<data.length;i++) {
      if ( data[i].status == "registered" ) {
         $('#unitsRegisteredEnumeration').append("<br/>");
	      $('#unitsRegisteredEnumeration').append("<a href='" + data[i].url + "' style='text-decoration: none;'><img src='" + data[i].img + "' style='width:100px' /><br/>" + data[i].name + " - " + data[i].type + "</a>");
	      $('#unitsRegisteredEnumeration').append("<br/>");
      }
      else {
         $('#unitsUnregisteredEnumeration').append("<br/>");
	      $('#unitsUnregisteredEnumeration').append("<a href='" + data[i].url + "' style='text-decoration: none;'><img src='" + data[i].img + "' style='width:100px' /><br/>" + data[i].name + " - " + data[i].type + "</a>");
	      $('#unitsUnregisteredEnumeration').append("<br/>");
      }
	   if( i == data.length - 1 )
         $('#unitsRegisteredEnumeration').append("<br/>");
         $('#unitsUnregisteredEnumeration').append("<br/>");
   }
}

function getUnitsRegisteredEnumeration() {
   $.ajax({
      url: 'data/units.cgi?' + (new Date()).getTime(),
      method: 'GET',
      dataType: 'json',
      success: getUnitEnumerationSuccess,
      error: function(xhr, textStatus, errorThrown) {
         $('#unitsRegisteredEnumeration').html("");
         messageBox(trStrings.dataErrors.unitEnumeration + xhr.status + ' '+textStatus);
      }
   });
}

function getUnitsUnregisteredEnumeration() {
   $.ajax({
      url: 'data/units.cgi?' + (new Date()).getTime(),
      method: 'GET',
      dataType: 'json',
      success: getUnitEnumerationSuccess,
      error: function(xhr, textStatus, errorThrown) {
         $('#unitsUnregisteredEnumeration').html("");
         messageBox(trStrings.dataErrors.unitEnumeration + xhr.status + ' '+textStatus);
      }
   });
}


function getUnitInfo() {
   document.getElementById("unitInfo").innerHTML = "<br><br><br><br><img src='images/ajax-loader.gif' width='31' height='31' /><br><br>";
}

function getUnitEnumeration() {
   document.getElementById("unitEnumerate").innerHTML = ""
   document.getElementById("unitEnumerate").innerHTML += "<br>";
   document.getElementById("unitEnumerate").innerHTML += "<button onClick='getUnitInfo()'><img src='images/unitImage.jpg' style='width:100px' /><br/>Test - Unit</button>";
   document.getElementById("unitEnumerate").innerHTML += "<br>";
}

function refresh() {
    // ajax post to tell device to perform refresh
    // how long to wait before refresh is finished?
    //$('#unitEnumerate').html("<br /><br/><br /><br/><img src='images/ajax-loader-2.gif' /><br /><br/>"+injectStrings.refreshingList);
    //getUnitsRegisteredEnumeration();
    //getUnitsUnregisteredEnumeration();

    document.getElementById("unitEnumerate").innerHTML = "<br><br><br><br><img src='images/ajax-loader.gif' width='31' height='31' /><br><br>";
    getUnitEnumeration();
}