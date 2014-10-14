var express = require('express')
, router = express.Router()
, jwt = require('jwt-simple')
, DatabaseConn = require('../../Database/Database')
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
		console.log("The Token is " + req.params.token);

			  res.render('index',
				 { title : 'Home',names : 'beste',housenumber:'10020' ,plotname:'Kasarani'}
			
			   )
     })
    router.get('/about', function (req, res) {
				  res.render('about',
				 { title : 'Abouuuuuut',names : 'beste',id:'10020' }
			
			   )
     })

          router.get('/', function(req, res){res.redirect('/index.html');});
  
           router.post('/Login',   function(req, res) {
				DatabaseConn.getCredentials(req.body.username,req.body.password, function(err, user) {
				 if (err)  {  res.send(401);  }
				 if (!user) {res.send(401); } 
				 if (user !==null)
				 {
				   var token = jwt.encode({username: user._id}, tokenSecret);
					  res.json({token : token,role:user.role});	
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


module.exports = router