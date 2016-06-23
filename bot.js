/* Require modules */

var nodeTelegramBot = require('node-telegram-bot')
    , config = require('./config.json')
    , request = require("request")
    , cheerio = require("cheerio");

/* Functions */

/**
 * Repeat a string N times
 * @param  {Integer} n
 * @return {String}
 */

String.prototype.repeat = function(n){
    n= n || 1;
    return Array(n+1).join(this);
}

/**
 * Uses the request module to return the body of a web page
 * @param  {string}   url
 * @param  {callback} callback
 * @return {string}
 */

function getWebContent(url, callback){
  request({
    uri: url,
  }, function(error, response, body) {
    callback(body);
  });
}

/* Logic */

var recipeURL = 'http://www.random-recipes.com/index.php?page=index&filter=true';

var bot = new nodeTelegramBot({
  token: config.token
})
.on('message', function (message) {
  /* Process "/dinner" command */
  if (message.text == "/dinner" || message.text == "/dinner@" + config.botname) {
    console.log(message);
    getWebContent(recipeURL, function(data){
      // Parse DOM and recipe informations
      var $ = cheerio.load(data)
          , name = $(".recipe-name-title").text()
          , starsFull = $('.stars').children('.star-image-pos').length
          , starsEmpty = $('.stars').children('.star-image').length
          , ratings = $('.rating-text').text().replace(' Ratings', '')
          , prepTime = $('.stats-td-right').eq(0).text().trim()
          , cookTime = $('.stats-td-right').eq(1).text().trim()
          , servings = $('.stats-td-right').eq(2).text().trim()
          , author = $('.stats-td-right').eq(5).text().trim()
          , linkURL = 'http://www.random-recipes.com/' + $(".recipe-name").attr('href');

      // Send bot reply
      bot.sendMessage({
          chat_id: message.chat.id,
          text: 'What about "' + name + '"? \n' + linkURL + '\n' +
                '⚒ ' + prepTime + ' prep time' + '\n' +
                '🔥 ' + cookTime + ' cook time' + '\n' +
                '🍽 ' + servings + ' servings' + '\n' +
                '📄 added by ' + author + '\n' +
                '★'.repeat(starsFull) + '☆'.repeat(starsEmpty) + '(' + ratings + ' ratings)' + '\n'
      });
    });
  }
})
.start();
