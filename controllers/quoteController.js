
const Quote = require('../models/Quote');

// const TheQuote = "To fight the Empire is to be infected by its derangement. This is a paradox; whoever defeats a segment of the Empire becomes the Empire; it proliferates like a virus, imposing its form on its enemies. Thereby it becomes its enemies. - PKD"
let qdata = {
  quote: "Meow!!",
  author: "Sammy"
}
// only want to get a list of quotes once. Save it here for future reference
let qsave = []

// 
exports.home = function(req, res) {
  let quotes = new Quote(req.body, true);

  quotes.getQuoteList().then(function() {
    let y = Math.floor(Math.random() * quotes.data.length)
    qsave = quotes

    // let x = quotes.data.map(x=>{return x})

    res.render('home-page', {msg: quotes.data[y]});
  }).catch(function(err){
    res.render('home-page', {msg: qdata});
  })
}

exports.newQuote = function(req, res) {
  let y = Math.floor(Math.random() * qsave.data.length)
  res.render('home-page', {msg: qsave.data[y]});
}

exports.insertQuote = function(req, res) {
  // called when a new quote gets added to db
  let q = new Quote(req.body);
  console.log(req.body);

  q.insertQuote()
    .then(() => {
      res.redirect('/new');
    }).catch(function(errors) {
      // need to do something different here. 
      console.log(errors)
      res.redirect('/new')
    })

  res.render('newquote-page');
}
