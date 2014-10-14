var express = require('express');
var router = express.Router();

var DatabaseConn = require('../../Database/Database');

		router.post('/createHouse',DatabaseConn.CreateHouse);
        router.get('/houseList/:plot',DatabaseConn.listofHouse);
module.exports = router;