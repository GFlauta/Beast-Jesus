var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.body)
  res.redirect('pixel_page' + user.id);
});

module.exports = router;
