$(document).ready(function() { 

   $.validator.addMethod('IP4Checker', function(value) {
      var ip = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$";
          return value.match(ip);
      }, 'invalid ip');

	$.validator.addMethod('LuhnChecker', function(value) {
		var sum = 0;
		var numdigits = value.length;
		
		if( numdigits == 1 && value.charAt(0) == 0 )
			return true;
		
		if( numdigits != 6 )
			return false;
		
		var parity = numdigits % 2;
		for ( var i = 0; i < numdigits; i++) {
			var digit = parseInt(value.charAt(i))
			if (i % 2 == parity)
				digit *= 2;
			if (digit > 9)
				digit -= 9;
			sum += digit;
		}
		return (sum % 10) == 0;
	}, 'invalid dealer id');
   
   $("#contactsForm").validate({
      rules: {
	      email: {email:true},
	      dealerEmail: {email:true},
	      salesRepEmail: {email:true},
          country: {required:true},
	      dealerId: {LuhnChecker: true}
      },
      messages: {
	      email: "",
	      dealerEmail: "",
	      salesRepEmail: "",
		  country: "",
		  dealerId: ""
      },
      errorPlacement: function(error, element) {
	      if ( element.is(":radio") )
		      error.appendTo( element.parent().next().next() );
	      else if ( element.is(":checkbox") )
		      error.appendTo ( element.next() );
	      else
		      error.appendTo( element.parent().next() );
      }
   });
   $("#lanForm").validate({
      rules: {
	      ipAddress: {IP4Checker: true},
	      netmask: {IP4Checker: true},
	      gateway: {IP4Checker: true},
	      dns: {IP4Checker: true}
      },
      messages: {
	      ipAddress: "",
	      netmask: "",
	      gateway: "",
	      dns: ""
      },
      errorPlacement: function(error, element) {
	      if ( element.is(":radio") )
		      error.appendTo( element.parent().next().next() );
	      else if ( element.is(":checkbox") )
		      error.appendTo ( element.next() );
	      else
		      error.appendTo( element.parent().next() );
      }
   });
   $("#remoteForm").validate({
      rules: {
	      port: {range: [1, 65535]}
      },
      messages: {
	      smtpServer: "",
	      port: ""
      },
      errorPlacement: function(error, element) {
	      if ( element.is(":radio") )
		      error.appendTo( element.parent().next().next() );
	      else if ( element.is(":checkbox") )
		      error.appendTo ( element.next() );
	      else
		      error.appendTo( element.parent().next() );
      }
   });
   
   $("#notificationsForm").validate({
      rules: {
	      to1: {email: true},
	      to2: {email: true},
	      cc1: {email: true},
	      cc2: {email: true},
	      service: {email: true},
	      subject: {maxlength: 63},
	      body: {maxlength: 255}
      },
      messages: {
	      to1: "",
	      to2: "",
	      cc1: "",
	      cc2: "",
	      service: "",
	      subject: "",
	      body: ""
      },
      errorPlacement: function(error, element) {
	      if ( element.is(":radio") )
		      error.appendTo( element.parent().next().next() );
	      else if ( element.is(":checkbox") )
		      error.appendTo ( element.next() );
	      else
		      error.appendTo( element.parent().next() );
      }
   });
   
   $("#timeForm").validate({
      rules: {
	      hours: {range: [0, 23]},
	      minutes: {range: [0, 59]},
	      seconds: {range: [0, 59]}
      },
      messages: {
	      hours: "",
	      minutes: "",
	      seconds: ""
      },
      errorPlacement: function(error, element) {
	      if ( element.is(":radio") )
		      error.appendTo( element.parent().next().next() );
	      else if ( element.is(":checkbox") )
		      error.appendTo ( element.next() );
	      else
		      error.appendTo( element.parent().next() );
      }
   });

   $("#passwordForm").validate({
      rules: {
	      oldPassword: { required: true },
	      newPassword1: { required: true },
	      newPassword2: {
	         required:true,
	         equalTo: "#newPassword1"
	      }
      },
      messages: {
	      oldPassword: "",
	      newPassword1: "",
	      newPassword2: ""
      },
      errorPlacement: function(error, element) {
	      if ( element.is(":radio") )
		      error.appendTo( element.parent().next().next() );
	      else if ( element.is(":checkbox") )
		      error.appendTo ( element.next() );
	      else
		      error.appendTo( element.parent().next() );
      }
   });

   $("#repairForm").validate({
      rules: {
	      datepicker2: {
	         required: true
	      },
	      newRepair: {
	         required:true
	      }
      },
      messages: {
	      datepicker2: "",
	      newRepair: ""
      },
      errorPlacement: function(error, element) {
	      if ( element.is(":radio") )
		      error.appendTo( element.parent().next().next() );
	      else if ( element.is(":checkbox") )
		      error.appendTo ( element.next() );
	      else
		      error.appendTo( element.parent().next() );
      }
   });


   
// no validation on backup form 

}); 
