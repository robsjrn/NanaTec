var express = require('express');
var router = express.Router();

var DatabaseConn = require('../../Database/Database');

		  router.post('/CreatePropertyOwner',DatabaseConn.CreatePropertyOwner);
		  router.post('/ContactExists',DatabaseConn.ContactExists);
		  router.post('/PropertyListing',DatabaseConn.PropertyListing); 
		  router.post('/PropertyRegistration',DatabaseConn.PropertyRegistration);
		  router.post('/login',function(req,res){
			  res.send(200);
		  });

module.exports = router;