var sARCHIVE               = 0;
var sRUNNING               = 1;
var sSTOPPED_CASSETTE_IN   = 2;
var sSTOPPED_CASSETTE_OUT  = 3;
var runmode = 0;

var cycleData = {
   runmode:    "",
   temp:       "",
   pressure:   "",
   x_axis_points: 0
};

function getCycleData(dateCycle) {
   //messageBox('getting: data/cycleData.json');
   $.ajax({
      url: 'data/cycleData.cgi?' + (new Date()).getTime(),
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(dateCycle),
      success: onCycleDataSuccess,
      error: function (xhr, textStatus, errorThrown) { 
         messageBox(trStrings.postErrors.cycleData + xhr.status + ' '+textStatus);
      } 
   });
}

function onCycleDataSuccess(data) {
   if (typeof(data.succeeded) != 'undefined' && data.succeeded == true)
   {
      cycleData = data;
      setCycleStatus(data.status);
      setCycleDate(data.date);
      setCycleLog(data.log);
      drawChart(cycleData);
   }
   else
   {
      messageBox(trStrings.dataErrors.cycleData);
   }
}

function updateStatus() {
   var options = {};
   options.lastCount = cycleData.x_axis_points;
   $.ajax({
      url: 'data/status.cgi?' + (new Date()).getTime(),
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(options),
      //data: {"x_axis_points": new Number(numAxisPoints)},
      success: onUpdateStatusSuccess,
      error: function (xhr, textStatus, errorThrown) { 
         //messageBox(trStrings.postErrors.status + xhr.status + ' '+textStatus);
      } 
   });
}

function onUpdateStatusSuccess(data) {
   if (typeof(data.succeeded) != 'undefined' && data.succeeded)
   {
      setCycleStatus(data.status);
      setCycleDate(data.date);
      setCycleLog(data.log);
      
      // check current runmode to determine what to do
      if(data.runmode==sRUNNING) {
         if (runmode != sRUNNING)
         {
            cycleData.temp = "";
            cycleData.pressure = "";
            cycleData.x_axis_points = 0;
         }
         cycleData.temp = cycleData.temp + data.temp;
         cycleData.pressure = cycleData.pressure + data.pressure;
         cycleData.x_axis_points += data.x_axis_points;
         cycleData.runmode = data.runmode;
         runmode = data.runmode;
         drawChart(cycleData);
      } else if(data.runmode==sSTOPPED_CASSETTE_IN) {
         if(runmode==sRUNNING) { // prevents dialog from continually popping up
            cycleData.temp = cycleData.temp + " " + data.temp;
            cycleData.pressure = cycleData.pressure + " " + data.pressure;
            cycleData.x_axis_points += data.x_axis_points;
            cycleData.runmode = data.runmode;
            runmode = data.runmode;
            drawChart(cycleData);
            parent.setPrintPreviewLink(data.date+'-'+data.number);
            parent.openDialog();
         } else { // we were already stopped. do nothing.
            runmode = data.runmode;
         }
      } else if(data.runmode==sSTOPPED_CASSETTE_OUT) {
         cycleData.x_axis_points = 0;
         if (runmode == sSTOPPED_CASSETTE_IN)
         {
            parent.closeDialog();
         }
         runmode = data.runmode;
         $('#chart').css('visibility','hidden');
      } else if(data.runmode==sARCHIVE) {
         drawChart(data);
      }
   }
}



function drawChart(data) {
   //messageBox('DrawChart:\ntemp: '+data.temp+'\npressure: '+data.pressure+'\nx_axis_points: '+data.x_axis_points);
   cycleData = data;
   tempGraph.setAttribute("series",cycleData.temp);
	pressureGraph.setAttribute("series",cycleData.pressure);
	axis_object.setAttribute("x1",-cycleData.x_axis_points/9);
	axis_object.setAttribute("x2",cycleData.x_axis_points-1);
   
   tempGraph.$redraw();
   pressureGraph.$redraw();
   $('#chart').css('visibility','visible');
}

function setCycleStatus(status) {
   parent.document.getElementById('cycleStatus').innerHTML = status;
   //$('#cycleStatus').html(status);
}

function setCycleDate(date) {
   if(date)
      parent.document.getElementById('cycleDate').innerHTML = ' Date: '+date;
      //$('#cycleDate').html(' Date: '+date);
   else  
      parent.document.getElementById('cycleDate').innerHTML = '';;
      //$('#cycleDate').html('');
}

function setCycleLog(log) {
   parent.document.getElementById('printout').innerHTML = log.replace(/\n/g,"<BR />").replace(/\r/g,"");
   //$('#printout').html(log.replace(/\n/g,"<BR />").replace(/\r/g,""));
   /*
   var height = document.body.scrollHeight;
   if(parent.resetHeight)
      parent.resetHeight(height+10+'px');
   */
}

function clear() {
   $('#chart').css('visibility','hidden');
   setCycleStatus("");
   setCycleDate("");
   setCycleLog("");
}