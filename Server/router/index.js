

module.exports = function (app) {

/*
   app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
      });
    });
*/
     app.use('/web', require('./routes/MainRoutes'));
     app.use('/web/Landlord', require('./routes/LandlordRoutes'));
	 app.use('/web/Tenant', require('./routes/TenantRoutes'));
	 app.use('/web/House', require('./routes/HouseRoutes'));
	 app.use('/web/Property', require('./routes/PropertyRoutes'));
	 app.use('/web/Admin', require('./routes/AdminRoutes'));
     app.use('/web/Reports', require('./routes/ReportsRoutes'));
	 app.use('/web/Download', require('./routes/DownloadRoute'));
	 app.use('/web/Sms', require('./routes/SmsRoutes'));
	 
};