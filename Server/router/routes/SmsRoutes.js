var express = require('express'),
 router = express.Router(),
  twilio = require('twilio'),

 DatabaseConn = require('../../Database/Database');


  
 router.get('/test', function(req, res){
	 res.send("Sms Server Up and Running..");
	 ;});

router.post('/inboundVoice', function(request, response) {
  
   // response.send('<Response><Say>Hello there! Thanks for calling.</Say></Response>');

       var resp = new twilio.TwimlResponse();
    resp.say({voice:'woman'}, 'Welcome to Nana !');
    resp.gather({ timeout:30 }, function() {
 
         this.say('For balance inquiry, press 1. For support, press 2.');
 
    });
	 response.writeHead(200, {
        'Content-Type':'text/xml'
    });
    response.end(resp.toString());

});

router.post('/inboundSMS', function(request, response) {
	var body = request.param('Body').trim();
   console.log("got sms  a request from "+request.param('From'));
   DatabaseConn.findPhoneNumber(request.param('From'),function(err,status){
		if (status){

			if (status.role=="tenant")
			{
				 console.log("balance is  "+status.balance);
		          var msg="<Response><Sms>Hello "+status.names+" Your House Balance is "+ status.balance +"</Sms></Response>";
                 response.send(msg); 
			}
			else{
			     var msg="<Response><Sms>Hello "+status.names+" Your Expected Monthly Income is "+ status.expcMonthlyIncome+"</Sms></Response>";
                 response.send(msg); 
			}
		  
		}
		else{
            var msg="<Response><Sms>Sorry You Are not Registered</Sms></Response>"
           response.send(msg);
		}
		 
	});
   
});



module.exports = router;