var config = require('../Config/Config');

exports.setupJobs = function() {
	var BalanceReminder = require('./Daily/Reminder.js');

	var Agenda = require("Agenda");
	var agenda = new Agenda({db: { address: 'localhost:27017/agenda'}});
	BalanceReminder.sendReminder(agenda);
	agenda.every(config.JobConfig, 'process');

	 agenda.start();
};