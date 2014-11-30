var pdf = require('phantomjs-pdf'),
   Handlebars=require('handlebars'),
   fs=require('fs'),
   uuid = require('node-uuid'),
   DatabaseConn = require('../../Database/Database');

exports.ViewReport=function(req,res) {


   fs.readFile(__dirname + '/Templates/TenantList.html', 'utf8', function(err, html){
	   if (err){ res.status(501);}
	  
      else{
		     
             DatabaseConn.TenantListReport(req.body.plot,function(err,data){
			     if (data)
					 {
					     var template = Handlebars.compile(html);

					     var tenant ={"ReportFor":req.body.plot, "data1":data};
					     var result = template(tenant); 
                         var dat={};

					dat.result=result;
                 
				   if (req.body.option==="view")
				   {  
					   res.status(200).json(dat)
				   }
					   else{
                         var id =uuid.v4(),
							 reportname='./Client/Downloads/'+id+'.pdf'
						  
						        var options={
								   "html" : result,
								   "css"  :'./Client/styles/Reports/Report.css'
									   };
							pdf.convert(options, function(result) {
								result.toFile(reportname, function() {								
									    var file={};
										   file.filename=id,
										   file.filelocation=reportname
									    res.status(200).json(file) 
								  
								
								});
							});
					   }
                     
			    	 }
				 else{res.status(501);};
		    
	            });
	        }

		});

};


exports.TenantUnpaidReport=function(req,res) {



   
   fs.readFile(__dirname + '/Templates/TenantUnpaid.html', 'utf8', function(err, html){
	   if (err){ res.status(501);}
	  
      else{
		     
             DatabaseConn.TenantUnpaidReport(req.body.plot,function(err,data){
			     if (data)
					 {
					     var template = Handlebars.compile(html);

					     var tenant ={"ReportFor":req.body.plot, "data1":data};
					     var result = template(tenant); 
                         var dat={};

					dat.result=result;
                 
				   if (req.body.option==="view")
				   {  
					   res.status(200).json(dat)
				   }
					   else{
                         var id =uuid.v4(),
							 reportname='./Client/Downloads/'+id+'.pdf'
						  
						        var options={
								   "html" : result,
								   "css"  :'./Client/styles/Reports/Report.css'
									   };
							pdf.convert(options, function(result) {
								result.toFile(reportname, function() {								
									    var file={};
										   file.filename=id,
										   file.filelocation=reportname
									    res.status(200).json(file) 
								  
								
								});
							});
					   }
                     
			    	 }
				 else{res.status(501);};
		    
	            });
	        }

		});




};


exports.TenantpaidReport=function(req,res) {



   
   fs.readFile(__dirname + '/Templates/Tenantpaid.html', 'utf8', function(err, html){
	   if (err){ res.status(501);}
	  
      else{
		     
             DatabaseConn.TenantPaidReport(req.body.plot,function(err,data){
			     if (data)
					 {
					     var template = Handlebars.compile(html);

					     var tenant ={"ReportFor":req.body.plot, "data1":data};
					     var result = template(tenant); 
                         var dat={};

					dat.result=result;
                 
				   if (req.body.option==="view")
				   {  
					   res.status(200).json(dat)
				   }
					   else{
                         var id =uuid.v4(),
							 reportname='./Client/Downloads/'+id+'.pdf'
						  
						        var options={
								   "html" : result,
								   "css"  :'./Client/styles/Reports/Report.css'
									   };
							pdf.convert(options, function(result) {
								result.toFile(reportname, function() {								
									    var file={};
										   file.filename=id,
										   file.filelocation=reportname
									    res.status(200).json(file) 
								  
								
								});
							});
					   }
                     
			    	 }
				 else{res.status(501);};
		    
	            });
	        }

		});




};


exports.OccupiedHouses=function(req,res) {



   
   fs.readFile(__dirname + '/Templates/OccupiedHouses.html', 'utf8', function(err, html){
	   if (err){ res.status(501);}
	  
      else{
		     
             DatabaseConn.OccupiedHouseReport(req.body.plot,function(err,data){
			     if (data)
					 {
					     var template = Handlebars.compile(html);

					     var tenant ={"ReportFor":req.body.plot, "data1":data};
					     var result = template(tenant); 
                         var dat={};

					dat.result=result;
                 
				   if (req.body.option==="view")
				   {  
					   res.status(200).json(dat)
				   }
					   else{
                         var id =uuid.v4(),
							 reportname='./Client/Downloads/'+id+'.pdf'
						  
						        var options={
								   "html" : result,
								   "css"  :'./Client/styles/Reports/Report.css'
									   };
							pdf.convert(options, function(result) {
								result.toFile(reportname, function() {								
									    var file={};
										   file.filename=id,
										   file.filelocation=reportname
									    res.status(200).json(file) 
								  
								
								});
							});
					   }
                     
			    	 }
				 else{res.status(501);};
		    
	            });
	        }

		});




};


exports.VacantHouses=function(req,res) {



   
   fs.readFile(__dirname + '/Templates/VacantHouseReport.html', 'utf8', function(err, html){
	   if (err){ res.status(501);}
	  
      else{
		     
             DatabaseConn.vacantHouseReport(req.body.plot,function(err,data){
			     if (data)
					 {
					     var template = Handlebars.compile(html);

					     var tenant ={"ReportFor":req.body.plot, "data1":data};
					     var result = template(tenant); 
                         var dat={};

					dat.result=result;
                 
				   if (req.body.option==="view")
				   {  
					   res.status(200).json(dat)
				   }
					   else{
                         var id =uuid.v4(),
							 reportname='./Client/Downloads/'+id+'.pdf'
						  
						        var options={
								   "html" : result,
								   "css"  :'./Client/styles/Reports/Report.css'
									   };
							pdf.convert(options, function(result) {
								result.toFile(reportname, function() {								
									    var file={};
										   file.filename=id,
										   file.filelocation=reportname
									    res.status(200).json(file) 
								  
								
								});
							});
					   }
                     
			    	 }
				 else{res.status(501);};
		    
	            });
	        }

		});




};

exports.TransactionReport=function(req,res) {

   fs.readFile(__dirname + '/Templates/TransactionReport.html', 'utf8', function(err, html){
	   if (err){ res.status(501);}
	  
      else{          
		     
             DatabaseConn.TransactionReport(req.body.plot,req.body.startdate,req.body.enddate,function(err,data){
			     if (data)
					 {
					     
						 var template = Handlebars.compile(html),
					     tenant ={"ReportFor":req.body.plot, "data1":data},
					     result = template(tenant),
                         dat={};
					dat.result=result;
                 
				   if (req.body.option==="view")
				   {  
					   res.status(200).json(dat)
				   }
					   else{
                         var id =uuid.v4(),
							 reportname='./Client/Downloads/'+id+'.pdf'
						  
						        var options={
								   "html" : result,
								   "css"  :'./Client/styles/Reports/Report.css'
									   };
							pdf.convert(options, function(result) {
								result.toFile(reportname, function() {								
									    var file={};
										   file.filename=id,
										   file.filelocation=reportname
									    res.status(200).json(file) 
								  
								
								});
							});
					   }
                     
			    	 }
				 else{res.status(501);};
		    
	            });
	        }

		});




};



exports.AllHouses=function(req,res) {



   
   fs.readFile(__dirname + '/Templates/AllHouses.html', 'utf8', function(err, html){
	   if (err){ res.status(501);}
	  
      else{
		     
             DatabaseConn.AllHouses(req.body.plot,function(err,data){
			     if (data)
					 {
					     var template = Handlebars.compile(html);

					     var tenant ={"ReportFor":req.body.plot, "data1":data};
					     var result = template(tenant); 
                         var dat={};

					dat.result=result;
                 
				   if (req.body.option==="view")
				   {  
					   res.status(200).json(dat)
				   }
					   else{
                         var id =uuid.v4(),
							 reportname='./Client/Downloads/'+id+'.pdf'
						  
						        var options={
								   "html" : result,
								   "css"  :'./Client/styles/Reports/Report.css'
									   };
							pdf.convert(options, function(result) {
								result.toFile(reportname, function() {								
									    var file={};
										   file.filename=id,
										   file.filelocation=reportname
									    res.status(200).json(file) 
								  
								
								});
							});
					   }
                     
			    	 }
				 else{res.status(501);};
		    
	            });
	        }

		});




};
