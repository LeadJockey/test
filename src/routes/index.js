const express    = require('express');
const path       = require('path');
const router     = express.Router();
const Freemarker = require('freemarker.js');
const fm         = new Freemarker({
  viewRoot: path.join(__dirname, '..', '/templates'),
  options : {}
});
router.get('/', (req, res, next) => {
  fm.render('index.ftl', {}, (err, result, errout) => {
    res.send(err || result);
  })
});
router.get('/pc/:category/', (req, res, next) => {
    fm.render('error.ftl', {}, (err, result, errout) => {
      res.send(err || result);
    });
  }
);
router.get('/mo/:id/', (req, res, next) => {
  fm.render(path.join('/mo/promo/', req.params.id, '/index.ftl'), {title: req.params.id}, (err, result, errout) => {
      res.send(err || result);
    });
});
module.exports = router;