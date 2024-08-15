var express = require('express');
var router = express.Router();
const request = require('request');
const mongoose = require('mongoose');
const db = mongoose.connection;
const Schema = mongoose.Schema;
const mySchema = new Schema({ title: String , img_url: String, overview: String, popularity: Number}, {collection: 'movies_collection'});
const MyModel = mongoose.model('movies_collection', mySchema );

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Watchlist App' });
});


/* Search results post function. */
/**
 * @function
 * @param {string} search - your search query
 * Makes GET request from TMDB API
 * @returns {json} that is looped through by results.pug
 */
router.post('/results', function(req, res, next) {
  let query = req.body.search;
  let query_str = "https://api.themoviedb.org/3/search/movie?api_key=f00497ac3447654d34ec1913b192e4db&query=" + query;
    request(query_str, (error, response, body)=>{
        if(error){
            console.log(error);
        }else{
            let data = JSON.parse(body)['results'];
            res.render('result', {data: data, querySearch: query});
        }  
    })
});

/* Saving movies to checklist post function. */
/**
 * @function
 * @param {string} OR 
 * @param {array} id - the ids of the movie(s) you want
 * Saves to MongoDB
 */
router.post('/submitted', function(req, res, next) {
  if (Array.isArray(req.body.id)) {
    for (var i = 0; i < req.body.id.length; i++) {
      var info = req.body.id[i].split("::");
      var title = info[0];
      var name = 'Title' + String(i);
      var data = new MyModel({ title: info[0] , img_url: info[1], overview: info[2], popularity: info[3] });
      data.save((err) => { if (err) return "failed"; });
      res.cookie(name, title, { maxAge: 900000, httpOnly: false, encode: String});
    }
  }
  else if (typeof(req.body.id) == 'string') {
    var info = req.body.id.split("::");
    var title = info[0];
    var data = new MyModel({ title: info[0] , img_url: info[1], overview: info[2], popularity: info[3] });
    data.save((err) => { if (err) return "failed"; });
    res.cookie('Title1', title, { maxAge: 900000, httpOnly: false, encode: String});
  }
  res.render('submitted', {title: "Check your updated watchlist at /watchlist!"});
});

/* Watchlist get function. */
/**
 * @function
 * retrieves data from MongoDB
 * Displays it in view
 */
router.get('/watchlist', async function(req, res, next) {
  let list = [];
  for await (const doc of MyModel.find()) {
    list.push(doc.toJSON());
  }
  res.render('watchlist', { title: 'Your Watchlist', output: list});
});

module.exports = router;
