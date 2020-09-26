const { default: validator } = require('validator');

// const validator = require("validator");
const quoteCollection = require('../db').db().collection("quotes");

let Quote = function(data, loadQuotes) {
  this.data = data;
  // might need to track errors at some point.
  // this.errors = [];

  if (loadQuotes == undefined) {loadQuotes = false}
  if (loadQuotes) {this.getQuoteList()}
}

Quote.prototype.cleanup = function() {
  if(typeof(this.data.quote) != "string" ) {
    this.data.quote = "";
  }
  if(typeof(this.data.author) != "string" ) {
    this.data.author = "";
  }
  if(this.data.author.length < 1) {this.data.author = "Anon";}

  this.data = {
    quote: this.data.quote.trim(),
    author: this.data.author.trim()
  }
}

// this currently fails to validate for shit. The canned validate function only allows text/numbers.
// periods, dashes, etc. are all disallowed. So, TODO: write a real validate function. could probably
// do it with a regex.
Quote.prototype.validate = function() {
  // this rejects anything with a period, comma, dash etc. So, not useful
  // if (this.data.quote != "" && !validator.isAlphanumeric(this.data.quote)) {
  //   this.errors.push("Only letters, numberz or kittehz");
  // }

  // blacklist needs pretty much all the chars I am interested escaped.
  let fxd = validator.blacklist(this.data.quote, '(){}\\[\\]\\$\\<\\>');
  // console.log(this.data.quote);
  this.data.quote = fxd;
  console.log('q :' + this.data.quote);
    // let chars = '\\[\\]{}';
    // let fxd = this.data.quote.replace(new RegExp(`[${chars}]+`, 'g'), '');
    // console.log('fixed string not fucked: ' + fxd);

  if (!validator.isLength(this.data.quote, {min: 4, max: 800})) {this.errors.push("long or short too much little.")}
  console.log('errors: ' + this.errors);
}

Quote.prototype.insertQuote = function() {
  return new Promise(async (resolve, reject) => {
    this.validate();

    if(!this.errors.length) {
      await quoteCollection.insertOne(this.data);
      // calling resolve signifies that the Promise has completed. Probably need this.
      resolve();
    } else {
      console.log('Quotes insertQuote: insert skipped');
      reject(this.errors);
    }
  // resolve();
  })
}

Quote.prototype.getQuoteList = function() {
  return new Promise((resolve, reject) => {
    quoteCollection.find({}).project({_id: 0}).toArray().then((result) => {
        // console.log(result.length);
        if(result) {
          this.data = result;
          // console.log('getQuotes ', this.data)
          resolve('quotes collected');
        }
    })
    .catch((err) => {
      console.log('db fail and stuff', err)
      reject('db fail and stuff attempting to get list of quotes')
    })
  })
}

module.exports = Quote