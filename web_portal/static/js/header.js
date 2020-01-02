$(function() {
	getHeaderData();
});

function getHeaderData() {
   $.ajax({
      url: 'data/contacts.cgi?' + (new Date()).getTime(),
      method: 'GET',
      dataType: 'json',
      success: getHeaderDataSuccess,
      error: function (xhr, textStatus, errorThrown) {
         messageBox(trStrings.postErrors.contacts + xhr.status + ' '+textStatus);
      }
   });
}

function getHeaderDataSuccess(data) {
	if( typeof(data) != 'undefined' && data != null ) {
		//page header
		$('#office').html(data.officeName);
		if( data.officePhone != "" ) $('#officeTel').html(data.officePhone); else $('#officeTel').html("");
		$('#serialNum').html(data.serialNum);
		$('#logo').attr('src',data.logoURL);

		if (typeof (processContacts) != 'undefined')
			processContacts(data);
		if (typeof (processLinks) != 'undefined')
			processLinks(data.country);
		if (typeof (updateRegistrationLink) != 'undefined')
			updateRegistrationLink(data);
	}
}

function setTab(tab) {
   $('#nav-' + tab).addClass("selectedTab");
}
