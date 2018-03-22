const express    = require('express');
const app        = express();
const path       = require('path');
const Freemarker = require('freemarker.js');
const fm         = new Freemarker({
																		viewRoot: path.join(__dirname, 'src','templates'),
																		options : {}
																	});

app.set('port', 7000);

app.get('/', (req, res) => {
	fm.render('/index.ftl', {msg:'hit'}, (err, result, errout) => {
		res.send(errout || result);
	});
});
app.use('*', (req, res) => {res.json({status: 404})});
app.listen(app.get('port'), () => console.log(`sever listening on port ${app.get('port')}`));
module.exports = app;
