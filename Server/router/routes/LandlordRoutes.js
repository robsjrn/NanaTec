var express = require('express');
var router = express.Router();
var DatabaseConn = require('../../Database/Database');
var jwt = require('jwt-simple'),
 tokenSecret='1234567890QWERTY';
var Monthlyposting = require('../../Jobs/producer');


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
router.post('/CreateLandlord',DatabaseConn.CreateLandlord);
router.get('/LandLordDetails',ensureAuthenticated,DatabaseConn.LandLordDetails); 
router.get('/LandLordConfiguration',DatabaseConn.LandLordConfiguration);
router.get('/LandlordTenants',ensureAuthenticated,DatabaseConn.LandlordTenants);
router.post('/createTenant',ensureAuthenticated,DatabaseConn.CreateTenant);
router.post('/createHouse',ensureAuthenticated,DatabaseConn.CreateHouse);
router.post('/CheckPlotExist',DatabaseConn.CheckPlotExist);
router.post('/CheckHseNoExists',ensureAuthenticated,DatabaseConn.CheckHseNoExists);
router.post('/hseLookup',ensureAuthenticated,DatabaseConn.hseLookup);
router.post('/updateHsedetails',ensureAuthenticated,DatabaseConn.updateHsedetails);


	router.post('/LandlordAddPlots',ensureAuthenticated,DatabaseConn.LandlordAddPlots);
	router.post('/Landlordphotoupload',ensureAuthenticated,DatabaseConn.Landlordphotoupload);
	router.post('/MonthlyRentPosting',ensureAuthenticated,Monthlyposting.processJob);
	router.get('/GetLandlordNotice',ensureAuthenticated,DatabaseConn.GetLandlordNotice);
	router.post('/LandlordNoticeUpdate',ensureAuthenticated,DatabaseConn.LandlordNoticeUpdate);

		  router.get('/tenantList/:plot',ensureAuthenticated,DatabaseConn.listoftenant);
		  router.get('/houseList/:plot',ensureAuthenticated,DatabaseConn.listofHouse);

		 router.post('/RentalPayment',ensureAuthenticated,DatabaseConn.postTransaction);
           router.post('/BatchRentalPayment',ensureAuthenticated,DatabaseConn.BatchRentalPayment);

		 router.get('/bookedtenantList/:plot',ensureAuthenticated,DatabaseConn.listofbookedtenant);
		 
		router.get('/UnbookedtenantList/:plot',ensureAuthenticated,DatabaseConn.listofUnbookedtenant);
		router.get('/VacanthouseList/:plot',ensureAuthenticated,DatabaseConn.listofVacantHouse);


		router.post('/Rent',ensureAuthenticated,DatabaseConn.Rent);
		router.post('/vacate',ensureAuthenticated,DatabaseConn.vacate);
		router.post('/SaveDocument',ensureAuthenticated,DatabaseConn.Documents);
//to delete this not used *************
        router.post('/tenantDataID',ensureAuthenticated,DatabaseConn.tenantDataID);
        router.post('/tenantDataHseName',ensureAuthenticated,DatabaseConn.tenantDataHseName);
//********************

        router.post('/ServeEvictionNotice',ensureAuthenticated,DatabaseConn.EvictionNotice);
         router.post('/Mail',ensureAuthenticated,DatabaseConn.CreateMail);
         router.post('/CreateNotification',ensureAuthenticated,DatabaseConn.NotificationScheduling);



            router.post('/SearchReceipt',ensureAuthenticated,DatabaseConn.SearchReceipt);
			router.post('/GeneralSearch',ensureAuthenticated,DatabaseConn.GeneralSearch);
			router.post('/statement',ensureAuthenticated,DatabaseConn.statement);
			
            router.get('/TotalUnpaid',ensureAuthenticated,DatabaseConn.TotalUnpaid);
            router.get('/PaymentDateAggregation',ensureAuthenticated,DatabaseConn.PaymentDateAggregation);
            router.post('/DeleteReceipt',ensureAuthenticated,DatabaseConn.DeleteReceipt);
			 

    router.get('/ViewMessages',ensureAuthenticated,DatabaseConn.ViewMessages);
			
module.exports = router;