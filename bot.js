var nodeTelegramBot = require('node-telegram-bot')
    , config = require('./config.json');

var bot = new nodeTelegramBot({
  token: config.token
})
.on('message', function (message) {
  console.log(message);
})
.start();
