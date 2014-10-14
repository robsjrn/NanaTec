

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
     app.use('/', require('./routes/MainRoutes'));
     app.use('/Landlord', require('./routes/LandlordRoutes'));
	 app.use('/Tenant', require('./routes/TenantRoutes'));
	 app.use('/House', require('./routes/HouseRoutes'));
	 app.use('/Property', require('./routes/PropertyRoutes'));
	 app.use('/Admin', require('./routes/AdminRoutes'));
     app.use('/Reports', require('./routes/ReportsRoutes'));
	 app.use('/Download', require('./routes/DownloadRoute'));
	 
};