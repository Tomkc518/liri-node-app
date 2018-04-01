require('dotenv').config() //pulls keys out of a .env file

var keys = require("./keys.js"); //contains the template for the keys so you can keep your keys private
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify); //pulls the keys for spotify
var client = new Twitter(keys.twitter); //pulls the keys for twitter
//takes the inputs from the user
var liriCommand = process.argv[2];
var userEntry = process.argv[3];
//uses the liriCommand to pull in the last 20 tweets and console logs them
function getTweets(){
  client.get('statuses/user_timeline', 20, function(error, tweets) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++){
        console.log("--------------------------------------");
        console.log("Tweet number: " + (parseInt([i]) + 1));
        console.log('"' + tweets[i].text + '"');
        console.log(tweets[i].created_at);
      };
    };
  });
  commandLog();
};
//uses liriCommand to trigger function, and takes userEntry to feed the name of the track that the user wants to search
function useSpotify(){
  if (!userEntry){
    userEntry = "The Sign";
  };
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
  commandLog();
};
//uses liriCommand to trigger function, and takes userEntry to feed the name of the movie that the user wants to search
function getMovie(){
  if (!userEntry){
    userEntry = "Mr. Nobody";
  };
  var queryUrl = "http://www.omdbapi.com/?t=" + userEntry + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("--------------------------------------");
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("--------------------------------------");
    };
  });
  commandLog();
};
//log the liriCommand and userEntry history
function commandLog(){
  var log = "log.txt"
  fs.appendFile(log, liriCommand + ',"' + userEntry + '", ', function(err) {
    if (err) {
      console.log(err);
    }
  });
};
//if liriCommand is "do-what-it-says" then it pulls in the first and second positions in the random.txt file to populate the liriCommand and user Entry and then the correct fucntion is triggered with the new information
if (liriCommand === "do-what-it-says"){
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    };
    var dataArr = data.split(",");
    liriCommand = dataArr[0];
    userEntry = dataArr[1];
    switch (liriCommand) {
      case 'my-tweets':
        getTweets();
        break;
      case 'spotify-this-song':
        useSpotify()
        break;
      case 'movie-this':
        getMovie()
        break;
    };
  });
};
//accepts the other commands and runs their corresponding functions with the information entered by the user.
switch (liriCommand) {
    case 'my-tweets':
      getTweets();
      break;
    case 'spotify-this-song':
      useSpotify()
      break;
    case 'movie-this':
      getMovie()
      break;
};