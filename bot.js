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

var recipeURL = 'http://www.cookstr.com/searches/surprise';

var bot = new nodeTelegramBot({
  token: config.token
})
.on('message', function (message) {
  /* Process "/random" command */
  if (message.text == "/dinner") {
    console.log(message);
    getWebContent(recipeURL, function(data){
      // Parse DOM and recipe informations
      var $ = cheerio.load(data)
          , recipeName = $("meta[property='og:title']").attr('content')
          , recipeURL = $("meta[property='og:url']").attr('content');
      // Send bot reply
      bot.sendMessage({
          chat_id: message.chat.id,
          text: 'What about "' + recipeName + '"? ' + recipeURL
      });
    });
  }
})
.start();
