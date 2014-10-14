var kue = require('kue')
 , jobs = kue.createQueue() ;
   kue.app.listen(4022);
 var Monthly=require('./Server/Jobs/Monthly/MonthlyPostingProcess.js');
 var MailProcess=require('./Server/Jobs/Daily/TenantBalanceReminder.js');               
 

 jobs.process('Monthly Posting Process', function (job, done){
	 try{
		  Monthly.ProccessRequest(job.data.plotname,job.data.month,function(err,status){
			             if (err) { done(err )  }
					   else {done(); }
		      });
        
      }
  catch(e){
		  console.log("Serious Error Occurred for Consumer" + e);
		   // Alway log serious Errors
			 }
 });



  jobs.process('Daily Tenant balance Process', function (job, done){
	 try{
		  MailProcess.MailProcess(job.data.plotname,function(err,status){
			       if (err) { done(err )  }
					else {done(); }
		      });
        
      }
       catch(e){
		  console.log("Serious Error Occurred for Consumer" + e);
		   // Alway log serious Errors
			 }
 });


