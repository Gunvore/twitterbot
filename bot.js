var twit = require('twit');  
var config = require('./config.js');  

var Twitter = new twit(config);  

// STREAM USER BOT ==========================

var stream = Twitter.stream('statuses/filter', { follow: config.Users_tracking_list })

stream.on('tweet', function (tweet) {

  Twitter.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
    if (err) {
        console.log('---');
        console.log("Error: " + err.message);
      } else {
        console.log('---');
        console.log('retweet:', tweet.user.screen_name);
      }
  })

})




// STREAM HASH BOT ==========================
var stream2 = Twitter.stream('statuses/filter', { track: config.Hash_tracking_list })

stream2.on('tweet', function (tweet) {
 console.log(tweet.user.screen_name);
  var url = findUrls(tweet.text);
  var m =  url + " " + String(tweet.text).match(/#\w+/g);
  

  if(url!='' && tweet.user.screen_name != "SlugWar"){
   Twitter.post('statuses/update', { status: m }, function (err, data, response) {
          if (err) {
              console.log('---');
              console.log("Error: " + err.message);
            } else {
              console.log('---');
              console.log('twitter:',  m);
            }
        })
   
  }
   
})


//STREAM follow to reply thanks
var stream3 = Twitter.stream('user');  
stream3.on('follow', function (event) {
  var screenName = event.source.screen_name;
  var text = "Hi "+screenName+" and thank you for following me. I will retweet everything you say with #slugwarapp related to video games.";
  Twitter.post("direct_messages/new" , { screen_name:screenName, text:text}, function (err, data, response) {
    if (err) {
        console.log('---');
        console.log("Error: " + err.message);
      } else {
        console.log('---');
        console.log('private message sent:', screenName);
      
        Twitter.post('friendships/create', {
          'screen_name': screenName,
          'follow': true
        }, function (err, data, response) {
          if (err) {
              console.log('---');
              console.log("Error: " + err.message);
            } else {
              console.log('---');
              console.log('followed:', screenName);
            }
        })
        
      }
  })
})
 




// retweet HASH BOT ==========================
var stream4 = Twitter.stream('statuses/filter', { track: config.Hash_Retweet_list })

stream4.on('tweet', function (tweet) {

  Twitter.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
    if (err) {
        console.log('---');
        console.log("Error: " + err.message);
      } else {
        console.log('---');
        console.log('retweet:', tweet.user.screen_name);
      }
  })

})


      
/**
 * A utility function to find all URLs - FTP, HTTP(S) and Email - in a text string
 * and return them in an array.  Note, the URLs returned are exactly as found in the text.
 * 
 * @param text
 *            the text to be searched.
 * @return an array of URLs.
 */
function findUrls( text )
{
    var source = (text || '').toString();
    var urlArray = [];
    var url;
    var matchArray;

    // Regular expression to find FTP, HTTP(S) and email URLs.
    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

    // Iterate through any URLs in the text.
    while( (matchArray = regexToken.exec( source )) !== null )
    {
        var token = matchArray[0];
        urlArray.push( token );
    }

    return urlArray;
}