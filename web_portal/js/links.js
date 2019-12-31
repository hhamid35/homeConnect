var links = {
	CA : {
		scican 		: "http://www.scican.com/?portal",
		tv 			: "http://www.scicancanada.ca/index.cfm?pagepath=Home/SciCanTV_videos&id=33111&portal",
		manual 		: "http://www.scicancanada.ca/index.cfm?pagepath=Home/Downloads&id=19873&portal",
		contact 	: "http://www.scicancanada.ca/index.cfm?pagepath=Home/Contact_us&id=16174&portal",
		techservice : "http://www.scicancanada.ca/index.cfm?pagepath=Home/Customer_technical_service&id=16171&portal",
		privacy		: "http://www.scicancanada.ca/index.cfm?pagepath=Privacy&id=16177&portal",
		tos 		: "http://www.scicancanada.ca/index.cfm?pagepath=Terms_of_Use&id=62364&portal"
	},
	DE : {
		scican 		: "http://www.scican.com/?portal",
		tv 			: "http://www.scican.de.com/index.cfm?pagepath=Startseite/SciCanTV_videos&id=34192&portal",
		manual 		: "http://www.scican.de.com/index.cfm?pagepath=Startseite/Downloads&id=22768&portal",
		contact 	: "http://www.scican.de.com/index.cfm?pagepath=Startseite/Kontakt&id=22767&portal",
		techservice : "http://www.scican.de.com/index.cfm?pagepath=Startseite/Kundendienst_technischer_Service&id=22741&portal",
		privacy		: "http://www.scican.de.com/index.cfm?pagepath=Datenschutz&id=22836&portal",
		tos 		: "http://www.scican.de.com/index.cfm?pagepath=Terms_of_Use&id=62382&portal"
	},
	GB : {
		scican 		: "http://www.scican.com/?portal",
		tv 			: "http://www.scican.uk.com/index.cfm?pagepath=Home/SciCanTV_videos&id=34173&portal",
		manual 		: "http://www.scican.uk.com/index.cfm?pagepath=Home/Downloads&id=20080&portal",
		contact 	: "http://www.scican.uk.com/index.cfm?pagepath=Home/Contact_us&id=20079&portal",
		techservice : "http://www.scican.uk.com/index.cfm?pagepath=Home/Customer_service&id=20068&portal",
		privacy		: "http://www.scican.uk.com/index.cfm?pagepath=Privacy&id=20174&portal",
		tos 		: "http://www.scican.uk.com/index.cfm?pagepath=Terms_of_Use&id=62380&portal"
	},
	US : {
		scican 		: "http://www.scican.com/?portal",
		tv 			: "http://www.scicanusa.com/index.cfm?pagepath=Home/SciCanTV_videos&id=33386&portal",
		manual 		: "http://www.scicanusa.com/index.cfm?pagepath=Home/Downloads&id=19955&portal",
		contact 	: "http://www.scicanusa.com/index.cfm?pagepath=Home/Contact_us&id=17951&portal",
		techservice : "http://www.scicanusa.com/index.cfm?pagepath=Home/Customer_technical_service&id=17939&portal",
		privacy		: "http://www.scicanusa.com/index.cfm?pagepath=Privacy&id=18036&portal",
		tos 		: "http://www.scicanusa.com/index.cfm?pagepath=Terms_of_Use&id=62378&portal"
	},
	CN : {
		scican 		: "http://www.scican.cn.com/?portal",
		tv 			: "http://www.scican.cn.com/index.cfm?pagepath=%E4%B8%BB%E9%A1%B5/SciCanTV_%E8%A7%86%E9%A2%91&id=34193&portal",
		manual 		: "http://www.scicanusa.com/index.cfm?pagepath=Home/Downloads&id=19955&portal",
		contact 	: "http://www.scican.cn.com/index.cfm?pagepath=%E4%B8%BB%E9%A1%B5/%E8%81%94%E7%B3%BB%E6%88%91%E4%BB%AC&id=20319&portal",
		techservice : "http://www.scican.cn.com/index.cfm?pagepath=%E4%B8%BB%E9%A1%B5/%E5%AE%A2%E6%88%B7%E6%9C%8D%E5%8A%A1/%E8%81%94%E7%B3%BB%E9%94%80%E5%94%AE%E5%92%A8%E8%AF%A2%E9%A1%BE%E9%97%AE&id=20314&portal",
		privacy		: "http://www.scican.cn.com/index.cfm?pagepath=%E9%9A%90%E7%A7%81%E6%9D%83&id=20413&portal",
		tos 		: "http://www.scican.cn.com/index.cfm?pagepath=Terms_of_Use&id=62376&portal"
	}
}


var countryToLink = {
		GB : links.GB,
		FR : links.GB,
		ES : links.GB,
		IT : links.GB,
		CZ : links.GB,
		SK : links.GB,
		DK : links.GB,
		NL : links.GB,
		NO : links.GB,
		RU : links.GB,
		PL : links.GB,
		HU : links.GB,
		DE : links.DE,
		US : links.US,
		CA : links.CA,
		JP : links.CA,
		CN : links.CN,
		HK : links.CN,
		TW : links.CN
}

function processLinks(val) {
	if(typeof(val) != 'undefined' && val != null) {
		if(typeof(countryToLink[val]) != 'undefined' && countryToLink[val] != null) {
			if($('a#linkScican').length && typeof(countryToLink[val].scican) != 'undefined') 
				$('a#linkScican').attr('href', countryToLink[val].scican);
			if($('a#linkTV').length && typeof(countryToLink[val].tv) != 'undefined') 
				$('a#linkTV').attr('href', countryToLink[val].tv);
			if($('a#linkOpmanual').length && typeof(countryToLink[val].manual) != 'undefined') 
				$('a#linkOpmanual').attr('href', countryToLink[val].manual);
			if($('a#linkContact').length && typeof(countryToLink[val].contact) != 'undefined') 
				$('a#linkContact').attr('href', countryToLink[val].contact);
			if($('a#linkTechservice').length && typeof(countryToLink[val].techservice) != 'undefined') 
				$('a#linkTechservice').attr('href', countryToLink[val].techservice);
			if($('a#linkPrivacy').length && typeof(countryToLink[val].privacy) != 'undefined') 
				$('a#linkPrivacy').attr('href', countryToLink[val].privacy);
			if($('a#linkTos').length && typeof(countryToLink[val].tos) != 'undefined') 
				$('a#linkTos').attr('href', countryToLink[val].tos);
		} else {
			if($('a#linkScican').length && typeof(countryToLink.CA.scican) != 'undefined') 
				$('a#linkScican').attr('href', countryToLink.CA.scican);
			if($('a#linkTV').length && typeof(countryToLink.CA.tv) != 'undefined') 
				$('a#linkTV').attr('href', countryToLink.CA.tv);
			if($('a#linkOpmanual').length && typeof(countryToLink.CA.manual) != 'undefined') 
				$('a#linkOpmanual').attr('href', countryToLink.CA.manual);
			if($('a#linkContact').length && typeof(countryToLink.CA.contact) != 'undefined') 
				$('a#linkContact').attr('href', countryToLink.CA.contact);
			if($('a#linkTechservice').length && typeof(countryToLink.CA.techservice) != 'undefined') 
				$('a#linkTechservice').attr('href', countryToLink.CA.techservice);
			if($('a#linkPrivacy').length && typeof(countryToLink.CA.privacy) != 'undefined') 
				$('a#linkPrivacy').attr('href', countryToLink.CA.privacy);
		}
	}
}

function updateRegistrationLink(data) {
	var hrefStr = "https://updates.scican.com/warrantyregistration.php?portal=1";
	var paramStr = "";
	
	if( typeof(data) != 'undefined' && data != null )
		paramStr = $.param(data);
	
	if(paramStr.length > 0)
		$('a#linkWarranty').attr('href', hrefStr+"&"+paramStr);
	else
		$('a#linkWarranty').attr('href', hrefStr);			
}

var hideStateOrProvinceCountry = {
		FR : true,
		FX : true,
}

function shouldHideStateOrProvince(str) {
	if( typeof(str) === 'string' && typeof(hideStateOrProvinceCountry[str]) === 'boolean' )	
		return hideStateOrProvinceCountry[str];
	return false;
}

var hideMiddleNameCountry ={
		CN : true,
		HK : true,
		TW : true
}

function shouldHideOfficeContactMiddleName(str) {
	if( typeof(str) === 'string' && typeof(hideMiddleNameCountry[str]) === 'boolean' )
		return hideMiddleNameCountry[str];
	return false;
}
