// app to display quotes and, like, store them in a database and stuff
// npm run watch

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// const ejs = require('ejs');

const app = express()
// configuration of a session
let sessionOptions = session({
  secret: "TheSecretPhrase",  // should be an un-guessable pw type string
  store: new MongoStore({client: require('./db')}), 
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1000 * 60 * 60 * 2, httpOnly: true} // timeout - 2 hours
})
app.use(sessionOptions);

// require executes the specified file and returns whatever that file returns.
const router = require('./router');

// set up the app receive data in the two most common methods
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// make the public folder great again.
app.use(express.static('public'));

app.set('views', 'views');
app.set('view engine', 'ejs');

// app.get('/', function(req, res) {
//   res.render('home-guest')
// });

app.use('/', router);

// app.listen(3000);
module.exports = app;