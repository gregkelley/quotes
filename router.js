const express = require('express');
const router = express.Router();
const quoteController = require('./controllers/quoteController');

// router.get('/', function(req, res) {
//   res.render('home-guest');
// });

router.get('/', quoteController.home);
// router.get('/newQuote', quoteController.newQuote);
router.post('/new', quoteController.newQuote);
router.post('/insert-quote', quoteController.insertQuote);

// router.post('/login', userController.login);
// router.post('/logout', userController.logout);

module.exports = router;