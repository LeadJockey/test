const express    = require('express');
const path       = require('path');
const index      = require('./src/routes/index');
const app        = express();

// routes
app.use('/', index);
// utils
app.use(express.static(path.join(__dirname, 'utils')));
// server
app.listen(3000, () => {console.log('sever listening on port 3000');});

module.exports = app;
