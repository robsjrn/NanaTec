var express = require('express'),
 router = express.Router(),
 jwt = require('jwt-simple'),
 tokenSecret='1234567890QWERTY',
 DatabaseConn = require('../../Database/Database');


      function ensureAuthenticated(req, res, next) {
				  try
					  {
						var decoded = jwt.decode(req.headers.token, tokenSecret);
						  req.user={};
						  req.user.username=decoded.username._id;
						  return next();
					  }
					  catch (e)
					  {
						   console.error(e);
						   res.json(401,{error: "Server Error"});
					 }
					  
			}


          router.post('/property',DatabaseConn.RegisterProperty); //create property

		  router.post('/CreatePropertyOwner',DatabaseConn.CreatePropertyOwner);
		  router.post('/PropertyOwnerProfile',ensureAuthenticated,DatabaseConn.PropertyOwnerProfile);
		  router.get('/PropertyOwnerDetails',ensureAuthenticated,DatabaseConn.PropertyOwnerDetails);
		  router.post('/ContactExists',DatabaseConn.ContactExists);
		  router.post('/UsernameExists',DatabaseConn.UsernameExists);
		  router.post('/PropertyListing',ensureAuthenticated,DatabaseConn.PropertyListing); 
		  router.post('/PropertyRegistration',ensureAuthenticated,DatabaseConn.PropertyRegistration);
         router.post('/GetProperty',ensureAuthenticated,DatabaseConn.GetProperty);
          router.post('/PropertyPhotoUpload',ensureAuthenticated,DatabaseConn.PropertyPhotoUpload);


    

		  router.post('/login',function(req,res){
			  DatabaseConn.PropertyOwnerCredentials(req.body.username,req.body.password, function(err, user) {
				 if (err)  {  res.send(401);  }
				 if (!user) {res.send(401); } 
				 if (user !==null)
				 {
				   var token = jwt.encode({username: user.username}, tokenSecret);
					  res.json({token : token,homepage:user.Homepage});	
						 }
				});
				   
		  });

		 router.get('/logout',DatabaseConn.logout);

module.exports = router;