// Importing required npm packages
var express = require('express');
var request = require('postman-request')

// Setting up the express router
var router = express.Router();

// Defining api key, base url, now-playing url and image base url for further use
const apiKey = '1fb720b97cc13e580c2c35e1138f90f8'
const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

// Middleware to store imageBaseUrl in local for all pages
router.use((req, res, next) => {
  	res.locals.imageBaseUrl = imageBaseUrl
	// Continue to the next piece of middleware
  	next()
})

// Setting home page route
router.get('/', (req, res, next) => {
	/**
   	* request.get takes 2 args:
   	* 1. it takes the url to http "get"
   	* 2. the callback to run when done: takes 3 args:
   	*  a. error (if any)
   	*  b. http response
   	*  c. json/data the server sent back
   	*/
	// Getting all shows playing currently
  	request.get(nowPlayingUrl, (error, response, movieData) => {
    	// console.log("====== ERROR ====== ");
    	// console.log(error);
    	// console.log("====== RESPONSE ======");
    	// console.log(response);
    	// console.log(movieData);
		// The movieData will be a string dump, here we are parsing it for using in the page
    	const parsedData = JSON.parse(movieData)
    	// res.json(parsedData)
		// Sending json data to index.ejs
    	res.render('index', {
      		parsedData: parsedData.results,
    	})
	})
})

// Setting router for specific movie, with using its id as a wildcard for url
router.get('/movie/:id', (req, res, next) => {
	// res.json(req.params.id)
	const movieId = req.params.id
	// Exact url for a specific movie, api key defined above is used here 
	const thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}` 
	// res.send(thisMovieUrl)
	// Requesting url and getting back the movie data, parsing it as we done before, then sending the json to single-movie.ejs
	request.get(thisMovieUrl, (error, response, movieData) => {
		const parsedData = JSON.parse(movieData)
		res.render('single-movie', {
			parsedData
		})
	})
})

// Search request has done here
router.post('/search', (req, res, next) => {
	// res.send('Sanity check')
	// Encoding uri for safe search
	const userSearchTerm = encodeURI(req.body.movieSearch)
	// Getting category for search url
	const cat = req.body.cat
	// Exact url with category, search term and api key
	const movieUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`
	// res.send(movieUrl)
	// Requesting movie url to get search results
	request.get(movieUrl, (error, response, movieData) => {
		// Error handler
		if (error) {
			console.log(error);
		}
		// Parsing to json
		let parsedData = JSON.parse(movieData)
		// Changing data according to category
		if (cat === "person") {
			parsedData.results = parsedData.results[0].known_for
		}
		// Sending json data to index.ejs
		res.render('index', {
			parsedData: parsedData.results
		})	
	})
})

// Exporting router to use in app.js
module.exports = router;
