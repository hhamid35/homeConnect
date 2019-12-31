var testComplete = true;
var testInterval = 0;
var browserLanguageChanged = false;
var initialUnsetCountry = false;
var pressureSensor;
var onFirstContactsLoad = true;
var pendingFlip;
var notSoRandomPassword = "notsorandompasswordnotsorandompasswordnotsorandompasswordnotsora";
var passwordState;
var remoteCheckTimer = null;

var formCleanSerial = {};

var pageFlipIdCur;
var pageFlipIdPrev;
var datepicker2NoFocus = true;

var emailUseUserSettings = false;

var timeOfLastBlur = 0;
var blurCheckTriggered = {};
var unitsFilled = false; //only want to fill dropdown menu with units once

$(function() {
   
   getUnits();
   getContacts();   
   getSetupData();
   getRepairData();
   
   $(function() {
	   $( "#datepicker" ).datepicker({ dateFormat: 'yy/mm/dd'});
	   $( "#datepicker2" ).datepicker({ dateFormat: 'yy/mm/dd'});
	   });
		
	$(function() {
	   $( ".button" ).button();
   });
   $(function() {
		$( "#tabs" ).tabs();
   });

	function mutExcl(c1, c2, t1) {
		$(c1).click(
				function() {
					if ($(t1).val().length == 0) {
						$(c1).removeAttr('checked');
						$(c2).removeAttr('checked');
					} else {
						if ($(this).attr('checked'))
							$(c2).attr('checked', false);
					}
					onChangeNotif();
				});
		$(c2).click(
				function() {
					if ($(t1).val().length == 0) {
						$(c1).removeAttr('checked');
						$(c2).removeAttr('checked');
					} else {
						var d = new Date();
						if ( typeof(blurCheckTriggered[c2]) != 'undefined'
								&& typeof(blurCheckTriggered[c2].checked) != 'undefined'
								&& typeof(blurCheckTriggered[c2].time) != 'undefined'
								&& blurCheckTriggered[c2].checked == true
								&& d.getTime() - blurCheckTriggered[c2].time < 300 ) {
							$(c2).attr('checked', 'checked');
							blurCheckTriggered[c2].checked = false;
						}

						if ($(this).attr('checked'))
							$(c1).attr('checked', false);
					}
					onChangeNotif();
				});
		$(t1).change(
				function() {
					if ($(t1).val().length > 0 
							&& $(c1).is(':checked') == false
							&& $(c2).is(':checked') == false) {
						$(c2).attr('checked', 'checked');

						var d = new Date();
						blurCheckTriggered[c2] = {checked: true, time: d.getTime()};
					} else if ($(t1).val().length == 0) {
						$(c1).removeAttr('checked');
						$(c2).removeAttr('checked');
					}
					onChangeNotif();
				});
	}
	
	mutExcl('input#emailAll', 'input#emailCF', 'input#officeEmail');
	mutExcl('input#to1All', 'input#to1CF', 'input#to1');
	mutExcl('input#to2All', 'input#to2CF', 'input#to2');
	mutExcl('input#cc1All', 'input#cc1CF', 'input#cc1');
	mutExcl('input#cc2All', 'input#cc2CF', 'input#cc2');
	mutExcl('input#emailAll', 'input#emailCF', 'input#officeEmail');

   $("#dialog-save-remind").dialog({
	   modal: true,
	   autoOpen: false,
	   closeOnEscape: false,
	   close: function() {
		   if( typeof(pendingFlip) == 'undefined' || pendingFlip == null || pendingFlip == "" ) {
			   pageFlipIdCur = pageFlipIdPrev;
		   }
	   },
	   title: injectStrings.dialogSaveRemindNote,
	   buttons: [
	             {
	            	 text: injectStrings.dialogSaveRemindSave,
	            	 click: function() {
	            		 pendingFlip = pageFlipIdCur;
	            		 
	            		 if( submitSaveChangesFor(pageFlipIdPrev) == false ) {
	            			 validationFailMessagebox(pageFlipIdPrev);
	            			 pendingFlip = "";
	            		 }
	            		 
	            		 $(this).dialog('close');
	            	 }
	             },
	             {
	            	 text: injectStrings.dialogSaveRemindDiscard,
	            	 click: function() {
	            		 pendingFlip = pageFlipIdCur;
	            		 discardChanges();
	            		 $(this).dialog('close');
	            	 }
	             }
	             ]
   });

});


$(document).ready(function(){
	
	$('.qtip-html-attached').each(function() {
		var attachId = '#'+$(this).attr('id')+'-qtip-html-attachment';
		if( typeof($(attachId)) != 'undefined' && $(attachId) != null ) {
			var attachIdMy = $(attachId).attr('data-qtip-my');
			var attachIdAt = $(attachId).attr('data-qtip-at');
			if( typeof(attachIdMy) == 'undefined' || attachIdMy == null || attachIdMy.length == 0 )
				attachIdMy = 'top left';
			if( typeof(attachIdAt) == 'undefined' || attachIdAt == null || attachIdAt.length == 0 )
				attachIdAt = 'bottom right';
			var attachIdDelayStr = $(attachId).attr('data-qtip-delay');
			var attachIdDelayInt;
			if( typeof(attachIdDelayStr) != 'undefined' && attachIdDelayStr != null && attachIdDelayStr.length > 0 )
				attachIdDelayInt = parseInt(attachIdDelayStr);

			if( typeof(attachIdDelayInt) != 'undefined' ) {
				$(this).qtip({
					content: {
//						text: $(attachId)
						text: function(api){
							return $(attachId);
						}
					},
					position: {
						my: attachIdMy,
						at: attachIdAt,
						viewport: $(window)
					},
					show: {
						event: 'click mouseenter'
					},
					hide: {
						delay: attachIdDelayInt,
						inactive: attachIdDelayInt
					}
				});
			} else {
				$(this).qtip({
					content: {
//						text: $(attachId)
						text: function(api){
							return $(attachId);
						}
					},
					position: {
						my: attachIdMy,
						at: attachIdAt,
						viewport: $(window)
					},
					show: {
						event: 'click mouseenter'
					}
				});
			}
		}
	});

	$('.tipLinkContacts').live('click', function(e) {
		e.preventDefault();
		if( onFirstContactsLoad == false )
			pageFlip('contacts');
	});

	$('.tipLinkNotifications').live('click', function(e) {
		e.preventDefault();
		if( onFirstContactsLoad == false )
			pageFlip('notifications');
	});

	$('.tipLinkRemote').live('click', function(e) {
		e.preventDefault();
		if( onFirstContactsLoad == false )
			pageFlip('remote');
	});

	$('.tipLinkPassword').live('click', function(e) {
		e.preventDefault();
		if( onFirstContactsLoad == false )
			pageFlip('password');
	});
	
	$('input#remotePassword').live('focus', function() {
		if( $(this).val() == notSoRandomPassword )
			$(this).attr("value", "");
	});
	
	$('input#remotePassword').live('focusout', function() {
		if( typeof(passwordState) != 'undefined' && passwordState != null ) {
			if( $(this).val() == "" && passwordState == 'value' )
				$(this).attr("value", notSoRandomPassword);
		}
	});
	
	$('.inputs-remote').blur(onChangeRemote);

//safari not happy
//	$('.inputs-remote').keyup(onChangeRemote);
//	$('.inputs-remote').bind('paste', function() {
//		setTimeout(onChangeRemote, 0);
//	});
	
	$('input#datepicker2').live('focus', function() {
		datepicker2NoFocus = false;
	});
	
//	$('a#backupDownloadSettings').hover(
//			function(){
//				if( 'object' === typeof $(this).data('qtip') && $(this).data('qtip') != null ) {
//					loadTipContent('a#backupDownloadSettings', )
//				}
//			}
//	);
	
	$('a#linkWarranty').live( 'click', function(e) {
		if( formDirty(pageFlipIdCur) ) {
			e.preventDefault();
			pageFlip('warranty');
		}
	});

	$('select#selectUnit').attr("style", "visibility: hidden");
	$('#copy').attr("style", "visibility: hidden");
	$('#copy').attr("disabled", true);
	
});


function hideSetupTab(id) {
	$('#'+id).css('display', 'none');
	fixSetupTabsWidth();
}

function showSetupTab(id) {
	$('#'+id).css('display', '');
	fixSetupTabsWidth();
}

function fixSetupTabsWidth() {
	var total_width = 0;
	$('#subnav-menu').children('li:visible').each(function(){
		total_width += $(this).outerWidth(true);
		});
	$('#subnav-menu').css('width', total_width.toString() + 'px');
}


function showStuff(id) {
	document.getElementById(id).style.display = 'block';
}
function hideStuff(id) {
	document.getElementById(id).style.display = 'none';
}

function pageFlipAction(id) {
	$('#contacts').css("display", "none"); 
	$('#lan').css("display", "none"); 
	$('#remote').css("display", "none"); 
	$('#notifications').css("display", "none"); 
	$('#time').css("display", "none"); 
	$('#password').css("display", "none"); 
	$('#backup').css("display", "none");
	$('#updates').css("display", "none"); 
	$('#tools').css("display", "none"); 
	
	
	$('#contactsLink').removeClass('active');
	$('#lanLink').removeClass('active');
	$('#remoteLink').removeClass('active');
	$('#notificationsLink').removeClass('active');
	$('#timeLink').removeClass('active');
	$('#passwordLink').removeClass('active');
	$('#backupLink').removeClass('active');
	$('#updatesLink').removeClass('active');
	$('#toolsLink').removeClass('active');
	
	hideAllInsideTabTips();
	
	$("#"+id).css("display", "inline"); 
	$('#'+id+"Link").addClass('active');
	
	triggerTipCheckForTab(id);
}

function serializeForm(id) {
	return $('form#'+id+'Form').serialize();
}

function submitSaveChangesFor(id) {
	if( typeof(id) != 'undefined' ) {
		if( id == 'contacts' ) {
			if( $('#contactsForm').valid() ) { 
				submitContact();
				return true;
			} else {
				return false;
			}
		} else if( id == 'lan' ) {
			if( $('#lanForm').valid() ) { 
				submitLAN();
				return true;
			} else {
				return false;
			}
		} else if( id == 'notifications' ) {
			if( $('#notificationsForm').valid() ) { 
				submitNotification(false);
				return true;
			} else {
				return false;
			}
		} else if( id == 'remote' ) {
			if( $('#remoteForm').valid() ) { 
				submitRemote(false);
				return true;
			} else {
				return false;
			}
		} else if( id == 'time' ) {
			submitTime();
			return true;
		} else if( id == 'password' ) {
			if( $('#passwordForm').valid() ) { 
				submitPassword();
				return true;
			} else {
				return false;
			}
		} else if( id == 'updates' ) {
			submitUpdates();
			return true;
		}
	}
	
	return false;
}

function formDirty(id) {
	var formDirtySerial = serializeForm(id);
	
	if( typeof(id) != 'undefined' && typeof(formDirtySerial) != 'undefined' && typeof(formCleanSerial[id]) != 'undefined' ) {
		if( formCleanSerial[id] != formDirtySerial )
			return true;
	}
	
	return false;
}

function actOnPendingFlip(type) {
	if( typeof(pendingFlip) != 'undefined' && pendingFlip != null && pendingFlip != "" ) {
		if ( pendingFlip == 'warranty' ) {
			pageFlipIdCur = pageFlipIdPrev;
			pageFlipIdPrev = "";
			clearPendingFlip();
		} else if( (type == 'override') ||
				(type == 'contacts' && pendingFlip == 'contacts') ||
				(type == 'setup' && (
						pendingFlip == 'lan' ||
						pendingFlip == 'remote' ||
						pendingFlip == 'notifications' ||
						pendingFlip == 'time' || 
						pendingFlip == 'password' ||
						pendingFlip == 'backup' ||
						pendingFlip == 'updates' ||
						pendingFlip == 'tools' ) ) ) {
			pageFlipAction(pendingFlip);
			clearPendingFlip();
		}
	}
}

function clearPendingFlip() {
	pendingFlip = "";
}

function discardChanges() {
	   getContacts();   
	   getSetupData();
	   getRepairData();
}

function validationFailMessagebox(id) {
	if( typeof(id) != 'undefined' ) {
		if( id == 'contacts' ) {
			messageBox(trStrings.postErrors.saveContacts);
		} else if( id == 'lan' ) {
			messageBox(trStrings.postErrors.lan);
		} else if( id == 'notifications' ) {
			messageBox(trStrings.postErrors.notif);
		} else if( id == 'remote' ) {
			messageBox(trStrings.postErrors.remotes);
		} else if( id == 'time' ) {
			messageBox(trStrings.postErrors.time);
		} else if( id == 'password' ) {
			messageBox(trStrings.postErrors.password);
		} else if( id == 'updates' ) {
			messageBox(trStrings.postErrors.updates);
		}
	}
}

function showSaveRemindDialog() {
	if( typeof(injectStrings.dialogSaveRemindNotSaved) != 'undefined' )
		$('#dialog-save-remind').html(injectStrings.dialogSaveRemindNotSaved);
	
	$('#dialog-save-remind').dialog('open');
}

function pageFlip(id) {
	if( typeof(id) != 'undefined' ) {
		if( typeof(pageFlipIdCur) != 'undefined' ) {
			
			if( pageFlipIdCur == id )
				return;

			pageFlipIdPrev = pageFlipIdCur;
			pageFlipIdCur = id;
			
			if( formDirty(pageFlipIdPrev) ) {
				showSaveRemindDialog();
			} else {
				pageFlipAction(pageFlipIdCur);
			}
		} else {
			pageFlipIdCur = id;
			pageFlipAction(pageFlipIdCur);
		}
	}
}

function triggerTipCheckForTab(id){
	if( id == 'contacts' ){
		onClickPrivacy();
	} else if( id == 'remote' ) {
		onChangeRemote();
//		startRemoteCheckTimer();
	} else if( id == 'notifications' ) {
		onChangeNotif();
	}
}

function startTest() {
   if(testComplete) { // only start test if we are not already running a test
      $('#networkTestResults').css("display", "inline");
      testComplete = false;
      submitTest(true);
      testInterval = setInterval("submitTest(false)",1000);
   }
}

function submitTest(start) {
   var options = {};
   options.start = start;
   $.ajax({
      url: 'data/testResults.cgi?' + (new Date()).getTime(),
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(options),
      success: testDataReceived,
      error: function (xhr, textStatus, errorThrown) { 
         messageBox(trStrings.postErrors.testResults + xhr.status + ' '+textStatus);
      } 
   });
}

var remoteAccessEnabled = false;
function remoteAccess() {
    var options = {};
    options.enable = !remoteAccessEnabled;
    
    $('body').addClass('loading');
    
    $.ajax({
        url: 'data/remoteAccess.cgi?' + (new Date()).getTime(),
        type: 'POST',
        // must be POST on server
        //type: 'GET',
        dataType: 'json',
        data: JSON.stringify(options),
        success: function(data) {
        	
        	$('body').removeClass('loading');
        	
            if (data.succeeded) {
                if (data.enabled) {
                    remoteAccessEnabled = data.enabled;
                    $('#remoteAccessUrl').html('<br/><b>URL:</b> <a href="http://updates.scican.com">http://updates.scican.com</a>');
                    $('#remoteAccessToken').html('<b>' + injectStrings.Token + '</b> ' + data.token);
                    $('#remoteAccessBtn').attr('value', trStrings.success.disableAccess);
                } else {
                    remoteAccessEnabled = data.enabled;
                    $('#remoteAccessUrl').html('');
                    $('#remoteAccessToken').html('');
                    $('#remoteAccessBtn').attr('value', trStrings.success.enableAccess);
                }
            } else {
                messageBox(trStrings.postErrors.remoteAccess);
      } 
        },
        error: function(xhr, textStatus, errorThrown) {
        	$('body').removeClass('loading');
            messageBox(trStrings.postErrors.remoteAccess + xhr.status + ' ' + textStatus);
        }
   });
}

var logoURL = 'images/officeLogo.png';
function uploadLogo() {
	$("#contactsLogoImage")
	.ajaxStart(function(){
		$(this).attr('src','images/ajax-loader-2.gif');
	})
	.ajaxComplete(function(){
		$(this).attr('src',logoURL);
		$('#logo').attr('src',logoURL);
		$(this).unbind('ajaxStart');
		$(this).unbind('ajaxComplete');
	});
	/*
		prepareing ajax file upload
		url: the url of script file handling the uploaded files
                     fileElementId: the file type of input element id and it will be the index of  $_FILES Array()
		dataType: it support json, xml
		secureuri:use secure protocol
		success: call back function when the ajax complete
		error: callback function when the ajax failed	
   */
   filename = $('#datafile').val();
   if(filename.length > 0) {
	   $.ajaxFileUpload
	   (
		   {
			   //url:'www.phpletter.com/Demo/AjaxFileUpload-Demo/contents/ajaxfileupload/doajaxfileupload.php', 
			   url:'data/logoUpload.cgi?' + (new Date()).getTime(),
			   secureuri:false,
			   fileElementId:'datafile',
			   dataType: 'json',
			   success: function (data, status)
			   {
               if (typeof(data) != 'undefined' && data != null && typeof(data.succeeded) != 'undefined' && data.succeeded == true)
               {
                  logoURL = data.logoURL;
               }
               else
               {
                  messageBox(trStrings.dataErrors.logoUpload);
               }
			   },
			   error: function (data, status, e)
			   {
				   messageBox(trStrings.postErrors.logoUpload + e);
			   }
		   }
	   )
	}
	return false;
}

function restoreSettings() {
	/*
		prepareing ajax file upload
		url: the url of script file handling the uploaded files
                     fileElementId: the file type of input element id and it will be the index of  $_FILES Array()
		dataType: it support json, xml
		secureuri:use secure protocol
		success: call back function when the ajax complete
		error: callback function when the ajax failed	
   */
   filename = $('#restore').val();
   if(filename.length > 0) {
	   
	   $('body').addClass('loading');
	   
	   $.ajaxFileUpload
	   (
		   {
			   url:'data/restore.cgi?' + (new Date()).getTime(),
			   secureuri:false,
			   fileElementId:'restore',
			   dataType: 'json',
			   success: function (data, status)
			   {
				   $('body').removeClass('loading');
				   submitResult(data, trStrings.success.restore,trStrings.dataErrors.restore);
				   getUnits();
				   getContacts();
				   getSetupData();
				   if (browserLanguageChanged) 
					   window.location.reload();
			   },
			   error: function (data, status, e)
			   {
				   $('body').removeClass('loading');
				   messageBox(trStrings.postErrors.restore + e);
			   }
		   }
	   )
	}
	return false;
}

function factoryDefaults() {
   if (confirm(trStrings.confirm.defaults))
   {
	   $('body').addClass('loading');
	   
      $.ajax({
         url: 'data/defaults.cgi?' + (new Date()).getTime(),
         type: 'POST',
         dataType: 'json',
         success: function (data) {
        	 $('body').removeClass('loading');
            submitResult(data, trStrings.success.defaults, trStrings.dataErrors.defaults);
            getContacts();   
            getSetupData();
            if(browserLanguageChanged)
            	window.location.reload();
         },
         error: function (xhr, textStatus, errorThrown) {
        	 $('body').removeClass('loading');
            messageBox(trStrings.postErrors.defaults + xhr.status + ' '+textStatus);
         } 
      });
   }
}

function testDataReceived(data) {
   if (typeof(data) != 'undefined' && data != null && typeof(data.succeeded) != 'undefined' && data.succeeded)
   {
      if (data.testComplete) testComplete = true;
      $('#test').html("<div style='border:1px solid #aaa;padding:10px;'>"+data.results+"</div>");
   }
   else
   {
      messageBox(trStrings.dataErrors.testResults);
      testComplete = true;
   }
   
   if (testComplete && testInterval)
   {
      clearInterval(testInterval);
   }
}

function getUnits() {
   $.ajax({
      url: 'data/units.cgi?' + (new Date()).getTime(),
      method: 'GET',
      dataType: 'json',
      success: getUnitsSuccess,
      error: function (xhr, textStatus, errorThrown) { 
         messageBox(trStrings.postErrors.contacts + xhr.status + ' '+textStatus);
      } 
   });
}

function getUnitsSuccess(data) {
	var i;
	for(i=0;i<data.length;i++) {
		if(data[i].name.indexOf(">") == -1) //if not main unit
			getContactsDiffTest(data[i].ip);
	}
}

function getContacts() {
   $.ajax({
      url: 'data/contacts.cgi?' + (new Date()).getTime(),
      method: 'GET',
      dataType: 'json',
      success: getContactsSuccess,
      error: function (xhr, textStatus, errorThrown) { 
         messageBox(trStrings.postErrors.contacts + xhr.status + ' '+textStatus);
      } 
   });
}

function getContactsSuccess(data) {
   //page header
   $('#office').html(data.officeName);
   $('#officeTel').html(data.officePhone);
   $('#serialNum').html(data.serialNum);
   logoURL = data.logoURL;
   $('#logo').attr('src',logoURL);
   $('#contactsLogoImage').attr('src',logoURL);

   //contacts
   $('select#officeContactTitle').val(data.officeContactTitle);
   $('input#officeContactFirstName').val(data.officeContactFirstName);
   $('input#officeContactMiddleName').val(data.officeContactMiddleName);
   $('input#officeContactLastName').val(data.officeContactLastName);
   
   $('input#officeName').val(data.officeName);
   $('input#officePhone').val(data.officePhone);
   $('input#officeFax').val(data.officeFax);
   $('input#officeAddress1').val(data.officeAddress1);
   $('input#officeAddress2').val(data.officeAddress2);
   $('input#city').val(data.city);
   $('input#state').val(data.state);
   
   if( shouldHideStateOrProvince(data.country) )
	   $('#setupInputstateOrProvince').attr('class', 'hideme');
   
   if( shouldHideOfficeContactMiddleName(data.country) )
	   $('#setupInputOfficeContactMiddleName').attr('class', 'hideme');
   
   if( data.country == "" )
	   initialUnsetCountry = true;
   
   $('input#zip').val(data.zip);
   $('input#officeContactPerson').val(data.officeContactPerson);    
   $('input#email').val(data.email);
   $('input#officeEmail').val(data.email);
   $("select#country").val(data.country);
   $("select#language").val(data.language);
   $('input#dealerName').val(data.dealerName);
   $('input#salesRepName').val(data.salesRepName);
   $('input#dealerPhone1').val(data.dealerPhone1);
   $('input#salesRepPhone1').val(data.salesRepPhone1);
   $('input#dealerPhone2').val(data.dealerPhone2);
   $('input#salesRepPhone2').val(data.salesRepPhone2);
   $('input#dealerEmail').val(data.dealerEmail);
   $('input#salesRepEmail').val(data.salesRepEmail);
   $('input#promo').attr('checked',data.promo);
   $('input#dealerId').val(data.dealerId);
   $('input#emailUseUserSettings').attr('checked',data.emailUseUserSettings);
   $('#contactsForm input[name=modelNo]').each(function(){$(this).val(data.modelNum);});
   $('#contactsForm input[name=unitType]').each(function(){$(this).val(data.unitType);});
   $('#contactsForm input[name=registrationKey]').each(function(){$(this).val(data.registrationKey);});
   $('#contactsForm input[name=serialNum]').each(function(){$(this).val(data.serialNum);});
   
   pressureSensor = data.pressureSensor;

   showHideRemotePage();
   
   formCleanSerial['contacts'] = serializeForm('contacts');
   
   if( onFirstContactsLoad ) {
	   pageFlip('contacts');
	   onFirstContactsLoad = false;
   }
   
   actOnPendingFlip('contacts');
}

function getContactsDiff() {

	   $.ajax({
	      url: 'http://' + $('#selectUnit').val() + '/data/contactsdiff.cgi?' + (new Date()).getTime() + '?callback=jsonpContactsWrapper',
	      type: 'GET',
	      dataType: 'jsonp'
	   });
	}

function getContactsDiffTest(unitIP) {

    $.ajax({
      url: 'http://' + unitIP + '/data/contactsdiff.cgi?' + (new Date()).getTime() + '?callback=jsonpContactsWrapper',
      type: 'GET',
      dataType: 'jsonp'
   });
}

	 
 function jsonpContactsWrapper(data) {
	if (!unitsFilled) { // for prefilling dropdown menu
		$('div#copySettings').removeClass('hideme');
		$('select#selectUnit').attr("style", "visibility: visible");
		$('#copy').attr("style", "visibility: visible");
		$('select#selectUnit').append($('<option></option>').val(data.ip).text(data.unitName + " - " + data.unitType));
	} else {
		// page header
		$('#office').html(data.officeName);
		$('#officeTel').html(data.officePhone);
		$('#serialNum').html(data.serialNum);
		logoURL = data.logoURL;
		$('#logo').attr('src', logoURL);
		$('#contactsLogoImage').attr('src', logoURL);

		// contacts
		$('select#officeContactTitle').val(data.officeContactTitle);
		$('input#officeContactFirstName').val(data.officeContactFirstName);
		$('input#officeContactMiddleName').val(data.officeContactMiddleName);
		$('input#officeContactLastName').val(data.officeContactLastName);

		$('input#officeName').val(data.officeName);
		$('input#officePhone').val(data.officePhone);
		$('input#officeFax').val(data.officeFax);
		$('input#officeAddress1').val(data.officeAddress1);
		$('input#officeAddress2').val(data.officeAddress2);
		$('input#city').val(data.city);
		$('input#state').val(data.state);

		if (shouldHideStateOrProvince(data.country))
			$('#setupInputstateOrProvince').attr('class', 'hideme');

		if (shouldHideOfficeContactMiddleName(data.country))
			$('#setupInputOfficeContactMiddleName').attr('class', 'hideme');

		if (data.country == "")
			initialUnsetCountry = true;

		$('input#zip').val(data.zip);
		$('input#officeContactPerson').val(data.officeContactPerson);
		$('input#email').val(data.email);
//		$('input#officeEmail').val(data.email);
		$("select#country").val(data.country);
		$("select#language").val(data.language);
		$('input#dealerName').val(data.dealerName);
		$('input#salesRepName').val(data.salesRepName);
		$('input#dealerPhone1').val(data.dealerPhone1);
		$('input#salesRepPhone1').val(data.salesRepPhone1);
		$('input#dealerPhone2').val(data.dealerPhone2);
		$('input#salesRepPhone2').val(data.salesRepPhone2);
		$('input#dealerEmail').val(data.dealerEmail);
		$('input#salesRepEmail').val(data.salesRepEmail);
		$('input#promo').attr('checked', data.promo);
		$('input#dealerId').val(data.dealerId);
		$('input#emailUseUserSettings').attr('checked',data.emailUseUserSettings);
		
		$('body').removeClass('loading');
	}
}

function getSetupData() {
   $.ajax({
      url: 'data/setup.cgi?' + (new Date()).getTime(),
      method: 'GET',
      dataType: 'json',
      success: onFormDataSuccess,
      error: function (xhr, textStatus, errorThrown) { 
         messageBox(trStrings.postErrors.setup + xhr.status + ' '+textStatus);
      } 
   });
}

function writeRemoteFrom(data) {
	if (typeof (data) != 'undefined' && data != null) {
		$('input#smtpServer').val(data.smtpServer);
		$('input#port').val(data.port);
		$('input#ssl').attr('checked', data.ssl);
		$('input#useAuth').attr('checked', data.useAuth);
		$('input#username').val(data.username);

		if (typeof (data.remotePassword) != 'undefined'
				&& data.remotePassword != null) {
			passwordState = 'value';
			notSoRandomPassword = data.remotePassword;
			if (passwordState == 'blank')
				$('input#remotePassword').val("");
			else
				$('input#remotePassword').val(notSoRandomPassword);
		}
		
		formCleanSerial['remote'] = serializeForm('remote');
	}
}

function onFormDataSuccess(data) {
   //contacts
	
   //lan
   $('input#autoIP').attr('checked',data.autoIP);
   $('input#ipAddress').val(data.ipAddress);
   $('input#netmask').val(data.netmask);
   $('input#gateway').val(data.gateway);
   $('input#dns').val(data.dns);
   $('input#deviceName').val(data.deviceName);
   
   onClickLanAutoIp();
   
   // remote
   // presets???
   $('input#smtpServer').val(data.smtpServer);
   $('input#port').val(data.port);
   $('input#ssl').attr('checked',data.ssl);
   $('input#useAuth').attr('checked',data.useAuth);
   $('input#username').val(data.username);
   
   
   if( typeof(data.remotePassword) != 'undefined' && data.remotePassword != null ) {
	   passwordState = 'value';
	   notSoRandomPassword = data.remotePassword;
	   if( passwordState == 'blank' )
		   $('input#remotePassword').val("");
	   else
		   $('input#remotePassword').val(notSoRandomPassword);
   }
   
   // notifications
   //officeEmail already populated...
   $('input#emailAll').attr('checked',data.emailAll);
   $('input#emailCF').attr('checked',data.emailCF);
   $('input#to1').val(data.to1);
   $('input#to1All').attr('checked',data.to1All);
   $('input#to1CF').attr('checked',data.to1CF);
   $('input#to2').val(data.to2);
   $('input#to2All').attr('checked',data.to2All);
   $('input#to2CF').attr('checked',data.to2CF);
   $('input#cc1').val(data.cc1);
   $('input#cc1All').attr('checked',data.cc1All);
   $('input#cc1CF').attr('checked',data.cc1CF);
   $('input#cc2').val(data.cc2);
   $('input#cc2All').attr('checked',data.cc2All);
   $('input#cc2CF').attr('checked',data.cc2CF);
   $('input#subject').val(data.subject);
   $('textarea#body').val(data.body);
   $('input#service').val(data.service);
   $('input#serviceAll').attr('checked',data.serviceAll);
   $('input#serviceCF').attr('checked',data.serviceCF);
   $('input#endOfSteri').attr('checked',data.endOfSteri);   
   $('input#maintNotif').attr('checked',data.maintNotif);   
   $('select#maintNotifPeriod').val(data.maintNotifPeriod);   
   $('select#maintNotifCycles').val(data.maintNotifCycles);   
   $('input#maintScheduled').val(data.maintScheduled);
   $('input#maintTriggerCycles').val(data.maintTriggerCycles);   

   // time
   $('input#timeUpdate').attr('checked',data.timeUpdate);
   $("select#timezone").val(data.timezone);
   $('input#hours').val(data.hours);
   $('input#minutes').val(data.minutes);
   $('input#seconds').val(data.seconds);
   $('input#datepicker').val(data.datepicker);
   $('input#datepicker2').val(data.datepicker);
   $('input#timeDST').attr('checked',data.timeDST);
   // password
   // do not populate old password
   //$('input#oldPassword').val(data.oldPassword);
   
   // backup
   
   // updates
   $('input#revision').val(data.revision);
   $('input#autoUpdate').attr('checked',data.autoUpdate);
   
   if (data.remoteAccess) {
       remoteAccessEnabled = true;
        $('#remoteAccessUrl').html('<br/><b>URL:</b> <a href="http://updates.scican.com">http://updates.scican.com</a>');
        $('#remoteAccessToken').html('<b>' + injectStrings.Token + '</b> ' + data.remoteAccessToken);
        $('#remoteAccessBtn').attr('value',trStrings.success.disableAccess);
    } else {
        remoteAccessEnabled = false;
        $('#remoteAccessUrl').html('');
        $('#remoteAccessToken').html('');
        $('#remoteAccessBtn').attr('value',trStrings.success.enableAccess);
    }
   
   //other
   $('input#promo').attr('checked',data.promo);
   $('input#emailUseUserSettings').attr('checked',data.emailUseUserSettings);
   
   showHideRemotePage();
	
   formCleanSerial['lan'] = serializeForm('lan'); 
   formCleanSerial['notifications'] = serializeForm('notifications');
   formCleanSerial['remote'] = serializeForm('remote');
   formCleanSerial['time'] = serializeForm('time');
   formCleanSerial['updates'] = serializeForm('updates');
   
   actOnPendingFlip('setup');
}

function submitResult(data, successStr, errorStr)
{
   if (typeof(data) != 'undefined' && data != null && typeof(data.succeeded) != 'undefined' && data.succeeded == true)
   {
      messageBox(successStr);
      return true;
   }
   else
   {
       if (typeof(data) != 'undefined' && data != null && typeof(data.error) != 'undefined') 
    	   errorStr += "\n\n" + data.error;
       
       messageBox(errorStr);
       return false;
   }
}

function getOfficeEmailData() {
	$.ajax({
		url: 'data/setup.cgi?' + (new Date()).getTime(),
		method: 'GET',
		dataType: 'json',
		success: onOfficeEmailDataSetupSuccess,
		error: function (xhr, textStatus, errorThrown) { 
			messageBox(trStrings.postErrors.setup + xhr.status + ' '+textStatus);
		} 
	});
	$.ajax({
		url: 'data/contacts.cgi?' + (new Date()).getTime(),
		method: 'GET',
		dataType: 'json',
		success: onOfficeEmailDataContactsSuccess,
		error: function (xhr, textStatus, errorThrown) { 
			messageBox(trStrings.postErrors.contacts + xhr.status + ' '+textStatus);
		} 
	});
}

function onOfficeEmailDataSetupSuccess(data) {
	if( typeof(data) != 'undefined' && data != null ) {
		$('input#emailAll').attr('checked',data.emailAll);
		$('input#emailCF').attr('checked',data.emailCF);
	}
	
	formCleanSerial['notifications'] = serializeForm('notifications');
}

function onOfficeEmailDataContactsSuccess(data) {
	if( typeof(data) != 'undefined' && data != null ) {
		$('input#officeEmail').val(data.email);
	}
	
	formCleanSerial['notifications'] = serializeForm('notifications');
}

function updateWarrantyLinkFromForm() {
	var hrefStr = "https://updates.scican.com/warrantyregistration.php?portal=1";
	var paramStr = "";
	
	if($('form#contactsForm').length)
		paramStr = $('form#contactsForm').serialize();
	
	if(paramStr.length)
		$('a#linkWarranty').attr('href', hrefStr+"&"+paramStr);
	else
		$('a#linkWarranty').attr('href', hrefStr);
}

function submitContact() {
   var contacts = {};
   contacts.officeContactTitle = $('select#officeContactTitle').val();
   contacts.officeContactFirstName = $('input#officeContactFirstName').val();
   if( shouldHideOfficeContactMiddleName($('select#country').val()) )
	   contacts.officeContactMiddleName = "";
   else
	   contacts.officeContactMiddleName = $('input#officeContactMiddleName').val();
   contacts.officeContactLastName = $('input#officeContactLastName').val();
   contacts.officeName = $('input#officeName').val();
   contacts.officePhone = $('input#officePhone').val();
   contacts.officeFax = $('input#officeFax').val();
   contacts.officeAddress1 = $('input#officeAddress1').val();
   contacts.officeAddress2 = $('input#officeAddress2').val();
   contacts.city = $('input#city').val();
   if( shouldHideStateOrProvince($('select#country').val()) )
	   contacts.state = "";
   else
	   contacts.state = $('input#state').val();
   contacts.zip = $('input#zip').val();
   contacts.officeContactPerson = $('input#officeContactPerson').val();
   contacts.email = $('input#email').val();
   contacts.country = $('select#country').val();
   contacts.language = $('select#language').val();
   contacts.dealerName = $('input#dealerName').val();
   contacts.salesRepName = $('input#salesRepName').val();
   contacts.dealerPhone1 = $('input#dealerPhone1').val();
   contacts.salesRepPhone1 = $('input#salesRepPhone1').val();
   contacts.dealerPhone2 = $('input#dealerPhone2').val();
   contacts.salesRepPhone2 = $('input#salesRepPhone2').val();
   contacts.dealerEmail = $('input#dealerEmail').val();
   contacts.salesRepEmail = $('input#salesRepEmail').val();
   contacts.promo = $('input#promo').is(':checked');
   contacts.dealerId = $('input#dealerId').val();
   
   $('body').addClass('loading');
   
   $.ajax({
      url: 'data/contacts.cgi?' + (new Date()).getTime(),
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(contacts),
      success: function (data) {
    	  
    	  $('body').removeClass('loading');
    	  
	if( browserLanguageChanged )
   	{
		window.location.reload();
	}
	else 
   	{
		updateWarrantyLinkFromForm();
		getHeaderData();
		getOfficeEmailData();

		if( typeof(data) != 'undefined' && data != null && typeof(data.succeeded) != 'undefined' && data.succeeded == true ) {
			formCleanSerial['contacts'] = serializeForm('contacts');
			actOnPendingFlip('override');
		} else {
			pageFlipIdCur = 'contacts';
			clearPendingFlip();
		}
		
		submitResult(data, trStrings.success.contacts, trStrings.dataErrors.contacts);
		
	}
      }, 
      error: function (xhr, textStatus, errorThrown) {
    	  $('body').removeClass('loading');
         messageBox(trStrings.postErrors.saveContacts + xhr.status + ' '+textStatus);
      } 
   });
}

function submitLAN() {
   var lan = {};
   lan.autoIP = $('input#autoIP').is(':checked');
   lan.ipAddress = $('input#ipAddress').val();
   lan.netmask = $('input#netmask').val();
   lan.gateway = $('input#gateway').val();
   lan.dns = $('input#dns').val();
   lan.deviceName = $('input#deviceName').val();
   
   $('body').addClass('loading');
   
   $.ajax({
      url: 'data/lan.cgi?' + (new Date()).getTime(),
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(lan),
      success: function (data) {
    	  $('body').removeClass('loading');
    	  
  		if( typeof(data) != 'undefined' && data != null && typeof(data.succeeded) != 'undefined' && data.succeeded == true ) {
    	  formCleanSerial['lan'] = serializeForm('lan'); 
    	  actOnPendingFlip('override');
  		} else {
  			pageFlipIdCur = 'lan';
  			clearPendingFlip();
  		}

    	  submitResult(data, trStrings.success.lan, trStrings.dataErrors.lan);
      },
      error: function (xhr, textStatus, errorThrown) {
    	  $('body').removeClass('loading');
         messageBox(trStrings.postErrors.lan + xhr.status + ' '+textStatus);
      } 
   });
}

function submitRemote(test) {
	var remote = {};
	remote.smtpServer = $('input#smtpServer').val();
	remote.port = parseInt($('input#port').val());
	remote.ssl = $('input#ssl').is(':checked');
	remote.useAuth = $('input#useAuth').is(':checked');
	remote.username = $('input#username').val();

	var tmp = $('input#remotePassword').val();
	if( typeof(tmp) != 'undefined' && tmp != null && tmp.length > 0 && tmp != notSoRandomPassword )
	{
			remote.remotePassword = tmp;
			notSoRandomPassword = tmp;
	}

	$('body').addClass('loading');

	$.ajax({
		url: 'data/remote.cgi?' + (new Date()).getTime(),
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify(remote),
		success: function (data) {

			if( test == false )
				$('body').removeClass('loading');

			if( typeof(data) != 'undefined' && data != null && typeof(data.succeeded) != 'undefined' && data.succeeded == true ) {
				if( typeof(tmp) != 'undefined' && tmp != null && tmp.length > 0 && tmp != notSoRandomPassword ) {
					passwordState = 'value';
					notSoRandomPassword = remote.remotePassword;
					$('input#remotePassword').val(notSoRandomPassword);
				}

				formCleanSerial['remote'] = serializeForm('remote');

				if( test == true ) {
					testRemote();
				} else {
					actOnPendingFlip('override');
					submitResult(data, trStrings.success.remote, trStrings.dataErrors.remote);
				}
			} else {
				pageFlipIdCur = 'remote';
				clearPendingFlip();
				submitResult(data, trStrings.success.remote, trStrings.dataErrors.remote);
			}

		},
		error: function (xhr, textStatus, errorThrown) { 
			$('body').removeClass('loading');
			messageBox(trStrings.postErrors.remotes + xhr.status + ' '+textStatus);
		} 
	});
}

function testRemote() {
	$('body').addClass('loading');
	
    $.ajax({
      url: 'data/testRemote.cgi?' + (new Date()).getTime(),
      type: 'GET',
      dataType: 'json',
      success: function (data) {
    	  $('body').removeClass('loading');
         submitResult(data, trStrings.success.testRemote, trStrings.dataErrors.testRemote);
      },
      error: function (xhr, textStatus, errorThrown) {
    	  $('body').removeClass('loading');
         messageBox(trStrings.postErrors.testRemote + xhr.status + ' '+textStatus);
      } 
   });
}

var presets = {
   'gmail': {
      'server': 'smtp.gmail.com',
      'port': 587,
      'ssl': true,
      'auth': true
   },
   'yahoo': {
      'server': 'smtp.mail.yahoo.com',
      'port': 587,
      'ssl': true,
      'auth': true
   },
   'msn': {
      'server': 'smtp-mail.outlook.com',
      'port': 587,
      'ssl': true,
      'auth': true
   },
   'gmx': {
      'server': 'mail.gmx.com',
      'port': 587,
      'ssl': true,
      'auth': true
   }
};

function doPreset() {
   var preset = $('select#preset').val();
   
   if (preset != 'none')
   {
      var data = presets[preset];
      
      if (typeof(data) != 'undefined' && data != null)
      {
         $('#smtpServer').val(data.server);
         $('#port').val(data.port);
         $('#ssl').attr('checked', data.ssl);
         $('#useAuth').attr('checked', data.auth);
      }
   }
   
   onChangeRemote();
}

function showHideRemotePage() {
	if($('input#emailUseUserSettings').attr('checked')) {
		showSetupTab('remoteLink');
		if( typeof(injectStrings.tipBackupSettingsRemote) != 'undefined' && injectStrings.tipBackupSettingsRemote.length > 0 )
			$('#backupDownloadSettings').qtip('option', 'content.text', injectStrings.tipBackupSettingsRemote);
	} else {
		hideSetupTab('remoteLink');
		if( typeof(injectStrings.tipBackupSettingsNoRemote) != 'undefined' && injectStrings.tipBackupSettingsNoRemote.length > 0 )
			$('#backupDownloadSettings').qtip('option', 'content.text', injectStrings.tipBackupSettingsNoRemote);
	}
}

function submitNotification(test) {
   var notifications = {};
   notifications.emailAll = $('input#emailAll').is(':checked');
   notifications.emailCF = $('input#emailCF').is(':checked');
   notifications.to1 = $('input#to1').val();
   notifications.to1All = $('input#to1All').is(':checked');
   notifications.to1CF = $('input#to1CF').is(':checked');
   notifications.to2 = $('input#to2').val();
   notifications.to2All = $('input#to2All').is(':checked');
   notifications.to2CF = $('input#to2CF').is(':checked');
   notifications.cc1 = $('input#cc1').val();
   notifications.cc1All = $('input#cc1All').is(':checked');
   notifications.cc1CF = $('input#cc1CF').is(':checked');
   notifications.cc2 = $('input#cc2').val();
   notifications.cc2All = $('input#cc2All').is(':checked');
   notifications.cc2CF = $('input#cc2CF').is(':checked');
   notifications.subject = $('input#subject').val();
   notifications.body = $('textarea#body').val();
   notifications.service = $('input#service').val();
   notifications.serviceAll = $('input#serviceAll').is(':checked');
   notifications.serviceCF = $('input#serviceCF').is(':checked');
   notifications.endOfSteri = $('input#endOfSteri').is(':checked');
   notifications.emailUseUserSettings = $('input#emailUseUserSettings').is(':checked');
   
   $('body').addClass('loading');

   $.ajax({
      url: 'data/notif.cgi?' + (new Date()).getTime(),
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(notifications),
      success: function (data) { 
    	  
		if( test == false )
			$('body').removeClass('loading');
    	  
  		if( typeof(data) != 'undefined' && data != null && typeof(data.succeeded) != 'undefined' && data.succeeded == true ) {
  			
  			writeRemoteFrom(data);
  			showHideRemotePage();
  			
  			if( typeof(pendingFlip) != 'undefined' ) {
  	  			if( pendingFlip == 'remote' ) {
  	  				if( $('#remoteLink').is(':visible') == false ) {
  	  	  				clearPendingFlip();
  	  	  				pageFlip('notifications');
  	  				}
  	  			} else if( pendingFlip == 'notifications' ) {
  	  				onChangeNotif();
    			}
  			} else {
  				onChangeNotif();
  			}
  			
  			
    	  formCleanSerial['notifications'] = serializeForm('notifications');
    	  
			if( test == true ) {
				testRemote();
			} else {
				actOnPendingFlip('override');
				submitResult(data, trStrings.success.notif, trStrings.dataErrors.notif);
			}
  		} else {
  			$('body').removeClass('loading');
  			
  			pageFlipIdCur = 'notifications';
  			clearPendingFlip();
  			submitResult(data, trStrings.success.notif, trStrings.dataErrors.notif);
  		}

         
      },
      error: function (xhr, textStatus, errorThrown) {
    	  $('body').removeClass('loading');
         messageBox(trStrings.postErrors.notif + xhr.status + ' '+textStatus);
      } 
   });
}

function getMaintData() {
	$.ajax({
		url: 'data/setup.cgi?' + (new Date()).getTime(),
		method: 'GET',
		dataType: 'json',
		success: onMaintDataSuccess,
		error: function (xhr, textStatus, errorThrown) { 
			messageBox(trStrings.postErrors.setup + xhr.status + ' '+textStatus);
		} 
	});
}

function onMaintDataSuccess(data) {
	if (typeof (data) != 'undefined' && data != null ) {
		$('input#maintNotif').attr('checked', data.maintNotif);
		$('select#maintNotifPeriod').val(data.maintNotifPeriod);
		$('select#maintNotifCycles').val(data.maintNotifCycles);
		$('input#maintScheduled').val(data.maintScheduled);
		$('input#maintTriggerCycles').val(data.maintTriggerCycles);
	}
}

function resetMaint() {
	var notifications = {};
	notifications.maintNotif = $('input#maintNotif').is(':checked');
	notifications.maintNotifPeriod = $('select#maintNotifPeriod').val();
	notifications.maintNotifCycles = $('select#maintNotifCycles').val();

	$('body').addClass('loading');

	$.ajax({
		url: 'data/resetMaint.cgi?' + (new Date()).getTime(),
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify(notifications),
		success: function (data) {
			$('body').removeClass('loading');
			getMaintData();
			submitResult(data, trStrings.success.notif, trStrings.dataErrors.notif);
		},
		error: function (xhr, textStatus, errorThrown) {
			$('body').removeClass('loading');
			alert(trStrings.postErrors.notif + xhr.status + ' '+textStatus);
		} 
	});
}


function submitTime() {
	var time = {};
	time.timeDST = $('input#timeDST').is(':checked');
	time.timeUpdate = $('input#timeUpdate').is(':checked');
	time.timezone = $('select#timezone').val();

	$('body').addClass('loading');

	$.ajax({
		url: 'data/time.cgi?' + (new Date()).getTime(),
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify(time),
		success: function (data) { 
			$('body').removeClass('loading');

			if( typeof(data) != 'undefined' && data != null && typeof(data.succeeded) != 'undefined' && data.succeeded == true ) {
				formCleanSerial['time'] = serializeForm('time');
				actOnPendingFlip('override');
			} else {
				pageFlipIdCur = 'time';
				clearPendingFlip();
			}

			datepicker2NoFocus = true;
			initializeUnitTimeTimer();
			submitResult(data, trStrings.success.time, trStrings.dataErrors.time);
		},
		error: function (xhr, textStatus, errorThrown) {
			$('body').removeClass('loading');
			messageBox(trStrings.postErrors.time + xhr.status + ' '+textStatus);
		} 
	});
}

function getTimeSettings() {
	$.ajax({
		url: 'data/setup.cgi?' + (new Date()).getTime(),
		method: 'GET',
		dataType: 'json',
		success: onTimeSettingsSuccess,
		error: function (xhr, textStatus, errorThrown) { 
			messageBox(trStrings.postErrors.setup + xhr.status + ' '+textStatus);
		} 
	});
}

function onTimeSettingsSuccess(data) {
	if (typeof (data) != 'undefined' && data != null ) {
		$('input#timeUpdate').attr('checked', data.timeUpdate);
	}
	
	formCleanSerial['time'] = serializeForm('time');
}



function updateTime() {
   var time = {};
   time.hours = parseInt($('input#hours').val());
   time.minutes = parseInt($('input#minutes').val());
   time.seconds = parseInt($('input#seconds').val());
   time.datepicker = $('input#datepicker').val();
   
   $('body').addClass('loading');
   
   $.ajax({
      url: 'data/updateTime.cgi?' + (new Date()).getTime(),
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(time),
      success: function (data) {
    	  $('body').removeClass('loading');
    	  submitResult(data, trStrings.success.updateTime, trStrings.dataErrors.updateTime);
    	  if( $('input#timeUpdate').is(':checked') ){
    		  onButtonPressManualTimeUpdate();
    	  }
    	  
    	  datepicker2NoFocus = true;
    	  getTimeSettings();
    	  initializeUnitTimeTimer();
      },
      error: function (xhr, textStatus, errorThrown) {
    	  $('body').removeClass('loading');
         messageBox(trStrings.postErrors.updateTime + xhr.status + ' '+textStatus);
      } 
   });
}

function submitPassword() {
   if ($('input#newPassword1').val() == $('input#newPassword2').val())
   {
      var password = {};
      password.oldPassword = $('input#oldPassword').val();
      password.newPassword = $('input#newPassword1').val();
      
      $('body').addClass('loading');
      
      $.ajax({
         url: 'data/password.cgi?' + (new Date()).getTime(),
         type: 'POST',
         dataType: 'json',
         data: JSON.stringify(password),
         success: function (data) {
        	 $('body').removeClass('loading');
        	 
        	 if( typeof(data) != 'undefined' && data != null && typeof(data.succeeded) != 'undefined' && data.succeeded == true ) {
        		 actOnPendingFlip('override');
        	 } else {
        		 pageFlipIdCur = 'password';
        		 clearPendingFlip();
        	 }

            submitResult(data, trStrings.success.password, trStrings.dataErrors.password);
         },
         error: function (xhr, textStatus, errorThrown) {
        	 $('body').removeClass('loading');
            messageBox(trStrings.postErrors.password + xhr.status + ' '+textStatus);
         } 
      });
   }
   else
   {
      messageBox(trStrings.alerts.password);
   }
}

function submitLCPassword() {
   if ($('input#newLCPassword1').val() == $('input#newLCPassword2').val())
   {
      var password = {};
      password.oldPassword = $('input#oldLCPassword').val();
      password.newPassword = $('input#newLCPassword1').val();
      
      $('body').addClass('loading');
      
      $.ajax({
         url: 'data/lcPassword.cgi?' + (new Date()).getTime(),
         type: 'POST',
         dataType: 'json',
         data: JSON.stringify(password),
         success: function (data) { 
        	 $('body').removeClass('loading');
        	 
        	 if( typeof(data) != 'undefined' && data != null && typeof(data.succeeded) != 'undefined' && data.succeeded == true ) {
        		 actOnPendingFlip('override');
        	 } else {
        		 pageFlipIdCur = 'password';
        		 clearPendingFlip();
        	 }

            submitResult(data, trStrings.success.password, trStrings.dataErrors.password);
         },
         error: function (xhr, textStatus, errorThrown) { 
        	 $('body').removeClass('loading');
            messageBox(trStrings.postErrors.password + xhr.status + ' '+textStatus);
         } 
      });
   }
   else
   {
      messageBox(trStrings.alerts.password);
   }
}

function submitUpdates() {
	var updates = {};
	updates.autoUpdate = $('input#autoUpdate').is(':checked');

	$('body').addClass('loading');

	$.ajax({
		url: 'data/updates.cgi?' + (new Date()).getTime(),
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify(updates),
		success: function (data) {
			$('body').removeClass('loading');

			if( typeof(data) != 'undefined' && data != null && typeof(data.succeeded) != 'undefined' && data.succeeded == true ) {
				formCleanSerial['updates'] = serializeForm('updates');
				actOnPendingFlip('override');
			} else {
				pageFlipIdCur = 'updates';
				clearPendingFlip();
			}

			submitResult(data, trStrings.success.updates, trStrings.dataErrors.updates);
		},
		error: function (xhr, textStatus, errorThrown) {
			$('body').removeClass('loading');
			messageBox(trStrings.postErrors.updates + xhr.status + ' '+textStatus);
		} 
	});
}

function updateFirmware() {
	/*
		prepareing ajax file upload
		url: the url of script file handling the uploaded files
                     fileElementId: the file type of input element id and it will be the index of  $_FILES Array()
		dataType: it support json, xml
		secureuri:use secure protocol
		success: call back function when the ajax complete
		error: callback function when the ajax failed	
   */
   filename = $('#manualInterface').val();
   if(filename.length > 0) {
	   $.ajaxFileUpload
	   (
		   {
			   url:'data/updateFirmware.cgi?' + (new Date()).getTime(),
			   secureuri:false,
			   fileElementId:'manualInterface',
			   dataType: 'json',
			   success: function (data, status)
			   {
				   submitResult(data, trStrings.success.updateFirmware, trStrings.dataErrors.updateFirmware);
			   },
			   error: function (data, status, e)
			   {
				   messageBox(trStrings.postErrors.updateFirmware + e);
			   }
		   }
	   )
	}
	return false;
}

function countryChanged(){
	browserLanguageChanged = true;
	initialUnsetCountry = false;
}

function languageChanged(){
	browserLanguageChanged = true;
	
	if( initialUnsetCountry == true ){
		if( $('select#language').val() == "eng" && pressureSensor === true )
			$('select#country').val("GB");
		else if( $('select#language').val() == "eng" && pressureSensor === false )
			$('select#country').val("CA");
		else if( $('select#language').val() == "fra" )
			$('select#country').val("FR");
		else if( $('select#language').val() == "deu" )
			$('select#country').val("DE");
		else if( $('select#language').val() == "spa" && pressureSensor === true )
			$('select#country').val("ES");
		else if( $('select#language').val() == "spa" && pressureSensor === false )
			$('select#country').val("MX");
		else if( $('select#language').val() == "ita" )
			$('select#country').val("IT");
		else if( $('select#language').val() == "jpn" )
			$('select#country').val("JP");
		else if( $('select#language').val() == "ces" )
			$('select#country').val("CZ");
		else if( $('select#language').val() == "slk" )
			$('select#country').val("SK");
		else if( $('select#language').val() == "dan" )
			$('select#country').val("DK");
		else if( $('select#language').val() == "nld" )
			$('select#country').val("NL");
		else if( $('select#language').val() == "nor" )
			$('select#country').val("NO");
		else if( $('select#language').val() == "rus" )
			$('select#country').val("RU");
	}
}


function emailRepairLog() {
   var content = $('#repairLog').text();

   if(content.length>0) {
	   
	   $('body').addClass('loading');
	   
        $.ajax({
            url: 'data/emailRepairLog.cgi?' + (new Date()).getTime(),
            type: 'POST',
            // must be POST on server
            // type: 'GET',
            dataType: 'json',
            success: function (data) {
            	$('body').removeClass('loading');
                submitResult(data, trStrings.success.email, trStrings.dataErrors.email);
            },
            error: function (xhr, textStatus, errorThrown) {
            	$('body').removeClass('loading');
            messageBox(trStrings.postErrors.email + xhr.status + ' '+textStatus);
            } 
        });
   } else {
        messageBox(trStrings.postErrors.email + "Repair log is empty.");
   }
}

function getRepairData() {
   $.ajax({
      url: 'data/repair.cgi?' + (new Date()).getTime(),
      method: 'GET',
      dataType: 'json',
      success: onGetRepairDataSuccess,
      error: function (xhr, textStatus, errorThrown) { 
         messageBox(trStrings.postErrors.repair + xhr.status + ' '+textStatus);
      } 
   });
}

function onGetRepairDataSuccess(data) {
    if(data.length>0) {
        $('#repairLog').html('');
        for(var i=data.length-1;i>=0;i--) {
//            $('#repairLog').append("<b>"+data[i].date+"</b><br />");
//            var logMsg = data[i].log.replace(/\n/g, "<br />");
//            $('#repairLog').append(logMsg+"<br /><br />");
            $('#repairLog').append("<b>"+data[i].date+"</b><br/>");
            var logMsg = data[i].log;
            $('#repairLog').append(logMsg+"\n\n");
        }
    } else {
	$('#repairLog').html(trStrings.postErrors.repair);
        //messageBox(trStrings.postErrors.repair + "No repair data returned.");
    }
    
    formRepairClean = serializeForm('repair');
}

function addNewRepairRecord() {
   var date = $('input#datepicker2').val();
   var log = $('textarea#newRepair').val();

   if(date.length>0 && log.length>0) {
       var newLog = {};
       newLog.date = date;
       newLog.log = log;
       
       $('body').addClass('loading');
       
        $.ajax({
            url: 'data/addNewRepairLog.cgi?' + (new Date()).getTime(),
            type: 'POST',
            // must be POST on server
            // type: 'GET',
            dataType: 'json',
            data: JSON.stringify(newLog),
            success: function (data) {
            	$('body').removeClass('loading');
                submitResult(data, trStrings.success.addNewRepair, trStrings.dataErrors.addNewRepair);
                getRepairData();
            	$('textarea#newRepair').val('');
            },
            error: function (xhr, textStatus, errorThrown) {
            	$('body').removeClass('loading');
            messageBox(trStrings.postErrors.addNewRepair + xhr.status + ' '+textStatus);
            } 
        });
   } else {
        messageBox(trStrings.postErrors.email + "Repair date or log is empty.");
   }
}

function onClickLanAutoIp() {
	if( $('input#autoIP').attr('checked') )
		$('.cIpSettings').addClass('hideme');
	else
		$('.cIpSettings').removeClass('hideme');
}

function loadTipHideInactiveContent(target,my,at,inactive,content,classes){
	if( typeof(content) != 'undefined' && content != null && content.length > 0 ) {
		$(target).qtip({
			content: {
				text: content
			},
			position: {
				my: my,
				at: at,
				viewport: $(window)
			},
			show: {
				event: false,
				ready: true
			},
			hide: {
				inactive: inactive
			},
			style: {
				tip: {
					corner: true
				},
				classes: classes
			}
		});
	}
}

function loadTipContent(target,my,at,content,classes){
	if( typeof(content) != 'undefined' && content != null && content.length > 0 ) {
		$(target).qtip({
			content: {
				text: content
			},
			position: {
				my: my,
				at: at,
				viewport: $(window)
			},
			show: {
				event: false,
				ready: true
			},
			hide: false,
			style: {
				tip: {
					corner: true
				},
				classes: classes
			}
		});
	}
}

function onClickPrivacy() {
	if( 'object' === typeof $('#privacy-tos-box').data('qtip') && $('#privacy-tos-box').data('qtip') != null ) {
		if( $('input#promo').is(':checked') )
			$('#privacy-tos-box').qtip('hide');
		else
			$('#privacy-tos-box').qtip('show');
	} else {
		if( $('input#promo').is(':checked') == false )
			loadTipContent('#privacy-tos-box', 'top center', 'bottom center', injectStrings.tipContactsPrivacy, 'qtip-js-attached-inside-tab privacy-tos-qtip');
	}
}

function onButtonPressManualTimeUpdate() {
	loadTipHideInactiveContent('input#timeUpdate', 'right center', 'left center', 10000, injectStrings.tipTimeAutoTimeDisabled, 'qtip-js-attached-inside-tab');
}

function hideAllInsideTabTips() {
	$('.qtip-js-attached-inside-tab').qtip("hide");
	$('.qtip-html-attached').qtip("hide");
}


function anyNotifChecked() {
	if( $('input#to1All').is(':checked') || $('input#to1CF').is(':checked') || $('input#to2All').is(':checked') || $('input#to2CF').is(':checked') || $('input#cc1All').is(':checked') || $('input#cc1CF').is(':checked') || $('input#cc2All').is(':checked') || $('input#cc2CF').is(':checked') || $('input#emailAll').is(':checked') || $('input#emailCF').is(':checked') )
		return true;
	
	return false;
}

function anyRemoteFilled() {
	if( $('input#smtpServer').val().length > 0 && $('input#port').val().length > 0 && $('input#username').val().length > 0 && $('input#remotePassword').val().length > 0 )
		return true;
	
	return false;
}

function onChangeRemote() {
	var tipString = "";
	
	if( $('input#promo').is(':checked') == false && injectStrings.tipTestPrivacy.length > 0 )
		tipString = tipString + injectStrings.tipTestPrivacy;
	
	if( anyNotifChecked() == false && injectStrings.tipTestNotifications.length > 0 ) {
		if( tipString != "" )
			tipString = tipString + "<br/><br/>";
		
		tipString = tipString + injectStrings.tipTestNotifications;
	}

	if( anyRemoteFilled() == false && injectStrings.tipTestRemoteLocal.length > 0 ) {
		if( tipString != "" )
			tipString = tipString + "<br/><br/>";
		
		tipString = tipString + injectStrings.tipTestRemoteLocal;
	}
	
	if( tipString != "" ) {
		if( 'object' === typeof $('#buttonTestRemote').data('qtip') && $('#buttonTestRemote').data('qtip') != null ) {
			$('#buttonTestRemote').qtip('option', 'content.text', tipString);
			$('#buttonTestRemote').qtip('show');
		} else
			loadTipContent('#buttonTestRemote', 'right top', 'left center', tipString, 'qtip-js-attached-inside-tab');
	}
	else
		$('#buttonTestRemote').qtip('hide');
}

function showHideNotifTestButtonTip() {
	if($('#remoteLink').is(':visible')) {
		var tipString = "";
		
		if( $('input#promo').is(':checked') == false && injectStrings.tipTestPrivacy.length > 0 )
			tipString = tipString + injectStrings.tipTestPrivacy;
		
		if( anyNotifChecked() == false && injectStrings.tipTestNotificationsLocal.length > 0 ) {
			if( tipString != "" )
				tipString = tipString + "<br/><br/>";
			
			tipString = tipString + injectStrings.tipTestNotificationsLocal;
		}
		
		if( anyRemoteFilled() == false && injectStrings.tipTestRemote.length > 0 ) {
			if( tipString != "" )
				tipString = tipString + "<br/><br/>";
			
			tipString = tipString + injectStrings.tipTestRemote;
		}
		
		if( tipString != "" ) {
			if( 'object' === typeof $('#buttonTestNotif').data('qtip') && $('#buttonTestNotif').data('qtip') != null ) {
				$('#buttonTestNotif').qtip('option', 'content.text', tipString);
				$('#buttonTestNotif').qtip('show');
			} else
				loadTipContent('#buttonTestNotif', 'left center', 'right center', tipString, 'qtip-js-attached-inside-tab');
		}
		else
			$('#buttonTestNotif').qtip('hide');
	} else {
		var tipString = "";
		
		if( $('input#promo').is(':checked') == false && injectStrings.tipTestPrivacy.length > 0 )
			tipString = tipString + injectStrings.tipTestPrivacy;
		
		if( anyNotifChecked() == false && injectStrings.tipTestNotificationsLocal.length > 0 ) {
			if( tipString != "" )
				tipString = tipString + "<br/><br/>";
			
			tipString = tipString + injectStrings.tipTestNotificationsLocal;
		}
		
		if( tipString != "" ) {
			if( 'object' === typeof $('#buttonTestNotif').data('qtip') && $('#buttonTestNotif').data('qtip') != null ) {
				$('#buttonTestNotif').qtip('option', 'content.text', tipString);
				$('#buttonTestNotif').qtip('show');
			} else
				loadTipContent('#buttonTestNotif', 'left top', 'right center', tipString, 'qtip-js-attached-inside-tab');
		}
		else
			$('#buttonTestNotif').qtip('hide');
	}
}

function onChangeNotif() {
	showHideNotifTestButtonTip();
}

function copyToMainUnit() {
	$('body').addClass('loading');
	getContactsDiff();
}

function unitChanged() {
	$('#copy').attr("disabled", false);
	unitsFilled = true;
}
