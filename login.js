// login.js
const fs = require("fs");
const essentials = require("./essentials");

exports.run = function(bot) {
    essentials.checkForFile('token.txt', function() {
        fs.readFile('token.txt', 'utf8', function(err, contents) {
            if(contents.length > 0)
                token = contents;

            bot.login(token);
        });
    });
}