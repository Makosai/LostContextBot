const Discord = require("discord.js");
const bot = new Discord.Client();

var token = ""; // Put your token in here or in the token.txt file.

var debugging = false;

const fs = require("fs");

var data = {
    trivia: [
            // Themes
            {
                name: "Numbers",
                questions: [
                    { question: "What is the first number?", answers: ["1", "one"] },
                    { question: "What is the second number?", answers: ["2", "two"] }    
                ]
            },
            {
                name: "Letters",
                questions: [
                    { question: "What is the first letter?", answers: ["A", "a"] },
                    { question: "What is the second letter?", answers: ["B", "b"] }    
                ]
            },
    ],
    temp: null
};

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

    // ! command list
    if (message.content.charAt(0) === "!") {
        var tempVal = message.content.indexOf(' ');
        var command = message.content.substring(1, tempVal == -1 ? message.content.length : tempVal);
        var params = null;
 
        // Determine if the message has params after the command
        if (message.content.includes(' ')) {
            params = splitParams(message.content.substring(tempVal + 1, message.content.length));
        }
        
        switch (command) {
            
            case "trivia":
                /*
All output is sent via PM except for !trivia play
!trivia add "What is the bla bla bla?" "Answer Here"
!trivia themes `Outputs trivia themes. -- Game Questions below is one of them.`
!trivia questions "Game Questions" `Outputs a list of trivia questions and their possible answers. "[0]: What is bla bla bla
Answers: Answer here"`
!trivia remove "Game Questions" 0
!trivia play "Game Questions"
`What is bla bla bla?`
!trivia answer "answer here" <-- case insensitive.
                */
                if(params == null) {
                    message.channel.sendMessage("Incorrect parameters: `!trivia <themes|questions|answers|play|answer>`");
                    break;
                }
                
                console.log(params);
                console.log("[0]" + params[0]);
                switch(params[0]) {
                    // Themes are general topics for the trivia. (finished)
                    // This sub-command enables the users to do the following:
                    // Add new themes to the data array.
                    // Remove themes from the data array.
                    // Show all of the themes currently present in the data array.
                    case "themes":
                        if(params.length < 2) {
                            message.channel.sendMessage("Incorrect parameters: `!trivia themes <add|remove|show>`");
                            break;
                        }
                        
                        console.log("[1]" + params[1]);
                        switch(params[1]) {
                            case "add":
                                if(params[2] == null) {
                                    message.channel.sendMessage("Incorrect parameters: `!trivia themes add \"<name>\"`");
                                }
                                addTheme(params[2]);
                                break;
                            
                            case "remove":
                                if(params[2] == null) {
                                    message.channel.sendMessage("Incorrect parameters: `!trivia themes remove <index>`");
                                    break;
                                }
                                
                                var themeIndex = params[2];
                                if(data.trivia.length <= themeIndex) {
                                    message.channel.sendMessage("Incorrect index: Run `!trivia themes show` to get an index");
                                    break;
                                }
                                
                                message.channel.sendMessage("I am now removing **" + data.trivia[themeIndex].name + "** from the list of themes.");
                                removeTheme(themeIndex);
                                break;
                            
                            case "show":
                                var themes = "";
                                var themeIndex = -1;
                                data.trivia.forEach(function(theme) {
                                    themes += (themes.length > 0 ? "\n" : "") + "`[" + ++themeIndex + "]`" + " **" + theme.name + "**";
                                });
                                
                                message.channel.sendMessage(themes.length > 0 ? themes : "There are no theme entries yet.");
                                break;
                            
                            default:
                                message.channel.sendMessage("Incorrect parameters: `!trivia themes <add|remove|show>`");
                                break;
                        }
                        break;
                    
                    case "questions":
                        if(params.length < 2) {
                            message.channel.sendMessage("Incorrect parameters: `!trivia questions <add|remove|show>`");
                            break;
                        }
                        switch(params[1]) {
                            case "add":
                                if(params.length < 5) {
                                    message.channel.sendMessage("Incorrect parameters: `!trivia questions add \"<theme name>\" \"<question>\" \"<answer 1>\" \"[answer 2]\"`");
                                    break;
                                }
                                var _theme = params[2];
                                _theme = findTheme(_theme);
                                
                                if(_theme == null) {
                                    message.channel.sendMessage("The **" + params[2] + "** trivia theme does not exist.");
                                    break;
                                }
                                
                                var _question = params[3];
                                var _answers = params.slice(4, params.length);
                                addQuestion(_theme, _question, _answers);
                                break;
                                
                            case "remove":
                                if(params.length < 4) {
                                    message.channel.sendMessage("Incorrect parameters: `!trivia questions remove \"<theme name>\" <question index>`");
                                    break;
                                }
                                var _theme = params[2];
                                _theme = findTheme(_theme);
                                
                                if(_theme == null) {
                                    message.channel.sendMessage("The **" + params[2] + "** trivia theme does not exist.");
                                    break;
                                }
                                
                                removeQuestion(_theme, params[3]);
                                break;
                                
                            case "show":
                                if(params[2] == null) {
                                    message.channel.sendMessage("Incorrect parameters: `!trivia questions show \"<theme name>\" [+|-]` + to show answers.");
                                    break;
                                }
                                
                                var themeParam = params[2];
                                data.trivia.forEach(function(theme) {
                                    if(theme.name == themeParam) {
                                        themeParam = theme;
                                        return;
                                    }
                                });
                                
                                if(themeParam.name == null) {
                                    message.channel.sendMessage("I can't find **" + params[2] + "**.");
                                    break;
                                }
                                
                                var questionsList = "";
                                var questionIndex = -1;
                                var showAnswers = params[3] == null ? false : params[3] == "+" ? true : false;
                                themeParam.questions.forEach(function(q) {
                                    questionsList += (questionsList.length > 0 ? "\n" : "") + "`[" + ++questionIndex + "]` **" + q.question + "**" + (showAnswers ? "\n" + getAnswers(q.answers) : "" );
                                });
                                
                                message.channel.sendMessage(themeParam.questions.length > 0 ? questionsList : "There are no questions for **" + params[2] + "**.");
                                break;
                            
                            default:
                                message.channel.sendMessage("Incorrect parameters: `!trivia questions <add|remove|show>`");
                                break;
                        }
                        break;
                        
                    default:
                        message.channel.sendMessage("Incorrect parameters: `!trivia <themes|questions|play|answer>`");
                        break;
                }
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

// Core Functions
function addTheme(themeName) {
    var triviaTemplate = { name: themeName, questions: [] };
    data.trivia.push(triviaTemplate);
}

function removeTheme(theme) {
    data.trivia.splice(theme, 1);
}

function findTheme(themeName) {
    var foundTheme = null;
    data.trivia.forEach(function(theme) {
        if(theme.name == themeName) {
            foundTheme = theme;
            return;
        }
    });
    
    return foundTheme;
}

function addQuestion(theme, question, answers) {
    theme.questions.push({ question: question, answers: answers });
}

function removeQuestion(theme, question, answer) {
    theme.questions[question].answers.splice(answer, 1);
}

function getAnswers(triviaQuestion) {
    if(!(triviaQuestion.length > 0)) {
        return "There are no answers for this question.";
    }
    var answersList = "";
    var answerIndex = -1;
    triviaQuestion.forEach(function(a) {
        answersList += (answersList.length > 0 ? "\n" : "") + "    `[" + ++answerIndex + "]` " + a;
    });
    return answersList;
}

// Essential Functions

// http://stackoverflow.com/questions/10342728/join-array-from-startindex-to-endindex
Array.prototype.myJoin = function(seperator, start, end) {
  if (!start) start = 0;
  if (!end) end = this.length - 1;
  end++;
  return this.slice(start, end).join(seperator);
};

// http://stackoverflow.com/a/29016268
function checkForFile(fileName,callback)
{
    fs.exists(fileName, function (exists) {
        if(exists) {
            callback();
        } else {
            fs.writeFile(fileName, token, {flag: 'wx'}, function (err, data) 
            { 
                callback();
            })
        }
    });
}

let PARAM_REGEX = /[^\s"']+|"([^"]*)"|'([^']*)'/g;

function splitParams(command) {
  let match = null;
  let parts = [];

  while (match = PARAM_REGEX.exec(command)){
    parts.push(match[1] || match[2] || match[0]);
  }
  return parts;
}








// Login
checkForFile('token.txt', function() {
    fs.readFile('token.txt', 'utf8', function(err, contents) {
        if(contents.length > 0)
            token = contents;

        bot.login(token);
    });
});

/**

Should replace the nasty use of splits and stuff for getting commands in the future:
const PLAYER_REGEX = /([a-zA-Z]+)\-([a-zA-Z]+)(\s*,\s*([a-zA-z]+))?/;

function parse_player_string(player_string) {
    let match = player_string.match(PLAYER_REGEX);
    if (!match) {
        return null;
    } else {
        return {
            name: match[1],
            server: match[2],
            code: match[4]
        }
    }
}

**/