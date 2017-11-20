const express = require('express');
const path = require('path');
const SRC_ENTRY_PATH = path.join(__dirname, '..');
const router = express.Router();
const Freemarker = require('freemarker.js');
const fm = new Freemarker({
  viewRoot: path.join(SRC_ENTRY_PATH, 'templates'),
  options: {}
});

const compileFromFM = (req, res, next) => {
  fm.render('/mo/promo/hotstar/index.ftl', {title: 'freemarker'}, (err, result, errout) => {
    if (err) {
      res.send(err);
    }
    req.compiledHTML = result;
    next()
  });
};

router.get('/mo/:category/', compileFromFM, (req, res, next) => {
  res.send(req.compiledHTML);
});

router.get('/pc/:category/', (req, res, next) => {
  fm.render('/mo/promo/hotstar/index.ftl', {title: 'freemarker'}, (err, result, errout) => {
    res.send(err || result);
  });
});



module.exports = router;