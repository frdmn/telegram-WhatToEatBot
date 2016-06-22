/* Require modules */

var nodeTelegramBot = require('node-telegram-bot')
    , config = require('./config.json')
    , request = require("request")
    , cheerio = require("cheerio");

/* Functions */

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
          , recipeName = $(".recipe-name-title").text()
          , recipeURL = 'http://www.random-recipes.com/' + $(".recipe-name").attr('href');
      // Send bot reply
      bot.sendMessage({
          chat_id: message.chat.id,
          text: 'What about "' + recipeName + '"? ' + recipeURL
      });
    });
  }
})
.start();
