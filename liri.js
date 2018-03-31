require('dotenv').config()

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var liriCommand = process.argv[2];
var userEntry = process.argv[3];

switch (liriCommand) {
    case 'my-tweets':
      client.get('statuses/user_timeline', 20, function(error, tweets, response) {
        if (!error) {
          for (var i = 0; i < tweets.length; i++){
            console.log("--------------------------------------");
            console.log("Tweet number: " + (parseInt([i]) + 1));
            console.log('"' + tweets[i].text + '"');
            console.log(tweets[i].created_at);
          }
        }
      });
      break; 
    case 'spotify-this-song':
      spotify.search({ type: 'track', query: userEntry, limit: 5}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        for (var j = 0; j < 5; j++){
          console.log("--------------------------------------");
          console.log("Artist: " + data.tracks.items[j].artists[0].name);
          console.log("Song Title: " + data.tracks.items[j].name);
          console.log("Preview Link of Song: " + data.tracks.items[j].external_urls.spotify);
          console.log("Album: " + data.tracks.items[j].album.name);
          console.log("--------------------------------------");
        };
      });
      break;
    case 'movie-this':
      var queryUrl = "http://www.omdbapi.com/?t=" + userEntry + "&y=&plot=short&apikey=trilogy";
      request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          console.log("--------------------------------------");
          console.log("Title: " + JSON.parse(body).Title);
          console.log("Year: " + JSON.parse(body).Year);
          console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
          console.log("Rotten Tomates Rating: " + JSON.parse(body).Ratings[1].Value);
          console.log("Country: " + JSON.parse(body).Country);
          console.log("Language: " + JSON.parse(body).Language);
          console.log("Plot: " + JSON.parse(body).Plot);
          console.log("Actors: " + JSON.parse(body).Actors);
          console.log("--------------------------------------");
        };
      });
      break;
};