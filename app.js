var express=require('express'),
     app=express();
var multer  = require('multer')
var bodyParser = require('body-parser');
//var serveStatic = require('serve-static');

var jobSchedule = require('./Server/Jobs/job-schedule.js');



//app.use(serveStatic(__dirname + '/Client'));
app.use(multer({ dest: __dirname +'/Client/uploads/Temp'}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('views',  __dirname + '/Client/Partials');
app.set('view engine', 'jade');

var router = require('./Server/router')(app);

  app.listen(process.env.PORT || 4000);
  console.log('Rental App Started on Port 4000');
  jobSchedule.setupJobs();

module.exports = app;





