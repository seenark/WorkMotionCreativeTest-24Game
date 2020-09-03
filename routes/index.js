const express = require('express');
const router = express.Router();
const controller = require('../Controller/gameController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/game/:numbers',controller.index)

module.exports = router;
