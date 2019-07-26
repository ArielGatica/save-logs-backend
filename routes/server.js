const express = require('express');
const apiRoutes = express.Router();
const LogsOltRecovery = require('../controllers/controllers.oltRecovery');
const LogsOltCommands = require('../controllers/controllers.oltCommands');
const LogsOltFault = require('../controllers/controllers.oltFault');
const LogsOltMatch = require('../controllers/controllers.oltMatch');

//OLT Recovery
apiRoutes.route('/logs/olt-recovery').get(LogsOltRecovery.listOltRecovery);
apiRoutes.route('/logs/olt-recovery/save').get(LogsOltRecovery.saveOltRecovery);

//OLT Fault
apiRoutes.route('/logs/olt-fault').get(LogsOltFault.listOltFault);
apiRoutes.route('/logs/olt-fault/save').get(LogsOltFault.saveOltFault);

//OLT Commands
apiRoutes.route('/logs/olt-commands').get(LogsOltCommands.listOltCommands);
apiRoutes.route('/logs/olt-commands/save').get(LogsOltCommands.saveOltCommands);

//OLT Match
apiRoutes.route('/logs/olt-match').get(LogsOltMatch.oltMatch);


module.exports = apiRoutes;
