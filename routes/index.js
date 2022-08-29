var express = require('express');
var router = express.Router();
var request = require('postman-request')

const apiKey = '1fb720b97cc13e580c2c35e1138f90f8'
const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

/* GET home page. */
router.get('/', function(req, res, next) {
  /**
   * request.get takes 2 args:
   * 1. it takes the url to http "get"
   * 2. the callback to run when done: takes 3 args:
   *  a. error (if any)
   *  b. http response
   *  c. json/data the server sent back
   */
  request.get(nowPlayingUrl, (error, response, movieData) => {
    console.log("====== ERROR ====== ");
    console.log(error);
    console.log("====== RESPONSE ======");
    console.log(response);
  })
  res.render('index', {  });
});

module.exports = router;
