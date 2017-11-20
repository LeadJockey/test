const CONFIG  = require('./config/server.json');
const express = require('express');
const path    = require('path');
const routes  = require('./src/routes/index');
const app     = express();

app.use('/', routes);
app.use(express.static(path.join(__dirname, 'utils')));
app.listen(CONFIG.PORT, () => console.log('sever listening on port ' + CONFIG.PORT));
module.exports = app;
