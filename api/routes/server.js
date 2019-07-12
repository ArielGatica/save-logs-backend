const express = require('express');
const apiRoutes = express.Router();
const Logs = require('../controllers/controllers.logs');

//OLT Recovery
apiRoutes.route('/logs/olt-recovery').get(Logs.listOltRecovery);
apiRoutes.route('/logs/olt-recovery/save').get(Logs.saveOltRecovery);

//OLT Fault
apiRoutes.route('/logs/olt-fault').get(Logs.listOltFault);
apiRoutes.route('/logs/olt-fault/save').get(Logs.saveOltFault);

//OLT Commands
apiRoutes.route('/logs/olt-commands').get(Logs.listOltCommands);
apiRoutes.route('/logs/olt-commands/save').get(Logs.saveOltCommands);


module.exports = apiRoutes;
