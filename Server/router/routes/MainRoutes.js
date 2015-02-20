var express = require('express')
, router = express.Router()
, jwt = require('jwt-simple')
, DatabaseConn = require('../../Database/Database')
,userRoles = require('../../Config/routingConfig.js').userRoles
, tokenSecret='1234567890QWERTY';




   
	     function ensureAuthenticated(req, res, next) {
				  try
					  {
						var decoded = jwt.decode(req.headers.token, tokenSecret);
						  req.user={};
						  req.user._id=decoded.username;
						  return next();
					  }
					  catch (e)
					  {
						   console.error(e);
						   res.json(401,{error: "Server Error"});
					 }
					  
			}


        router.get('/Welcome/:token', function (req, res) {
        var decoded = jwt.decode(req.params.token, tokenSecret);
		   DatabaseConn.findUser(decoded.username, function(ok, user) {
             if ("ok")
             {          
               console.log("The User is " + user.names);
			   res.render('index', { title : 'Welcome Tenant',names : user.names,housenumber:user.housename ,plotname:user.plot.Plotname}  );
			  }
			  else{
				res.render('error', {error:'Sorry Serious Error Occurred'} );
			  }
    
		   });
         })

  
           router.post('/Login',   function(req, res) {
				DatabaseConn.getCredentials(req.body.username,req.body.password, function(err, user) {
				 if (err)  {  res.send(401);  }
				 if (!user) {res.send(401); } 
				 if (user !==null)
				 {
                     
				   var token = jwt.encode({username: user, accessrole:user.userRole.role}, tokenSecret);
				   var accessrole;
					       res.json({token : token,
						             role:user.role					       
						       });	
						 }
				});
				   
			  });


           router.get('/logout',DatabaseConn.logout);


        //Service that dont Require Login
          router.post('/ServiceRegistration',DatabaseConn.ServiceRegistration); 
          router.post('/ServiceListing',DatabaseConn.ServiceListing);
		  router.post('/VacantRentalListing',DatabaseConn.VacantRentalListing);
		  router.post('/CreateLandlord',DatabaseConn.CreateLandlord);
          router.post('/Recoverpwd',DatabaseConn.Recoverpwd);
          router.post('/CheckidExists',DatabaseConn.idExists);
          router.post('/CheckPlotExist',DatabaseConn.CheckPlotExist);
		  router.post('/CheckHseNoExists',DatabaseConn.CheckHseNoExists);
          router.post('/CheckPhonenumberExists',DatabaseConn.phonenumber);
          router.get('/Viewmail',ensureAuthenticated,DatabaseConn.Viewmail);
          router.post('/Mail',ensureAuthenticated,DatabaseConn.CreateMail);
		  router.post('/CheckPwd',ensureAuthenticated,DatabaseConn.CheckPwd);
		  router.post('/ChangePwd',ensureAuthenticated,DatabaseConn.ChangePwd);


module.exports = router