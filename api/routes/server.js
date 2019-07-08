const express = require('express');
const apiRoutes = express.Router();
const Logs = require('../controllers/controllers.logs');

apiRoutes.route('/logs').get(Logs.listLogs);
apiRoutes.route('/logs/watch').get(Logs.watchLogs);

module.exports = apiRoutes;