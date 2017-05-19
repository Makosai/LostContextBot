const Discord = require("discord.js");
const bot = new Discord.Client();

var token = ""; // Put your token in here or in the token.txt file.

var debugging = false;

const login = require("./login");
const essentials = require("./essentials");
const trivia = require("./trivia");
const server = require("./server");

var lastMessage = null;
var triviaChannel = "277540526675460096";

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.on("message", function(message) {
    
    // Make sure the bot doesn't disconnect.
    // Reply to the server's ping with pong.
    if (message.content === 'ping') {
        message.reply('pong');
    }

    // Make sure that only commands entered in #bot are registered.
    if (!(message.channel.name === "botstuff"))
        return;
    
    lastMessage = message;

    // ! command list
    if (message.content.charAt(0) === "!") {
        var tempVal = message.content.indexOf(' ');
        var command = message.content.substring(1, tempVal == -1 ? message.content.length : tempVal);
        var params = null;
 
        // Determine if the message has params after the command
        if (message.content.includes(' ')) {
            params = essentials.splitParams(message.content.substring(tempVal + 1, message.content.length));
        }
        
        switch (command) {
            
            case "trivia":
                trivia.run(command, params, message.channel);
                break;
                
            case "test":
                if(params == null) {
                    message.channel.sendMessage("Please, pass atleast one parameter for testing.");
                    break;
                }
                
                var allParams = "";
                params.forEach(function(str){ allParams += str + "\n"; });
                
                message.channel.sendMessage(allParams);
                break;

            // hello
            case "hello":
                message.channel.sendMessage("Hello, " + message.author.username + ".");
                break;
            
            case "poo":
                if(params != null) {
                    var allParams = "";
                    params.forEach(function(str){ allParams += str; });
                    allParams.trim();
                    message.channel.sendMessage("*flings poo at" + allParams + "*");
                    break;
                }
                message.channel.sendMessage("*flings poo at " + message.author.username + "*");
                break;
                
            case "help":
                message.channel.sendMessage("\
                `<> = required, [] = optional, | = or.`\n\
    \n\
    **Basic Commands**\n\
    - !trivia `Shows a list of other commands to try out (questions, answers, play, and answer still in development).`\n\
    - !test `Tests a new regex by printing all the parameters.`\n\
    - !hello `Sends a hello message back to the user.`\n\
    - !help `You goof.`\
                ");
                break;
            
            default:
                message.channel.sendMessage("That is not a command.");
                break;
        }
        
        // Just some debugging stuff to be used at any time.
        if (debugging) {
            console.log(message.author.username);
            console.log(message.content);
            console.log(message.content.charAt(0));
            console.log(message.content.includes(' '));
            console.log(command);
        }
    }
});

// Login
login.run(bot);


exports.test = function() { console.log("Client->Server comminication works!"); }
exports.getLastMessage = function() { return lastMessage; }
exports.getTriviaChannel = function() { return bot.channels.get(triviaChannel); }
exports.trivia = trivia;
exports.bot = bot;