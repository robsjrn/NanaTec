var Config = {};
Config.PM={};//property manager
Config.PL={};//property Lister
Config.PB={};//property Both manager and Lister

Config.JobConfig="'00 15 4 * * 0-6'"; //this is Every second
Config.AppUrl="104.131.100.150:4000";
Config.TenantWelcomeMsg="You Have Been Registered as a Tenant in One of Our Property for More Information Visit Us at http://104.131.100.150 use your id as username and Password";
Config.DatabaseUrl="mongodb://localhost:27017/RentalDB";
Config.tokenSecret='1234567890QWERTY';
Config.PL={"allowedPath":[ {  
            "name":"Home",
            "path":"/LandlordHome",
            "mainmenu":false
         },
         {  
            "name":"plots",
            "path":"/plotmngt",
            "mainmenu":true
         }],
		"Homepage":"/Account-PropertyListing.html",
		 "userrole":{ "userRole" : {
					 "id" : 1,
					 "role" : "admin"
                    }}		
			
			};
			
Config.PM={"allowedPath":[ {  
            "name":"Home",
            "path":"/LandlordHome",
            "mainmenu":false
         },
         {  
            "name":"plots",
            "path":"/plotmngt",
            "mainmenu":true
         }],
		"Homepage":"/Account-propertyManagement.html",	
         "userrole":{ "userRole" : {
					 "id" : 1,
					 "role" : "admin"
                    }}
 };

module.exports = Config




