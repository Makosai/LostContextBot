// trivia.js

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


exports.run = function(command, params, channel) {
    switch(command) {
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
                channel.sendMessage("Incorrect parameters: `!trivia <themes|questions|answers|play|answer>`");
                break;
            }

            switch(params[0]) {
                // Themes are general topics for the trivia. (finished)
                // This sub-command enables the users to do the following:
                // Add new themes to the data array.
                // Remove themes from the data array.
                // Show all of the themes currently present in the data array.
                case "themes":
                    if(params.length < 2) {
                        channel.sendMessage("Incorrect parameters: `!trivia themes <add|remove|show>`");
                        break;
                    }

                    switch(params[1]) {
                        case "add":
                            if(params[2] == null) {
                                channel.sendMessage("Incorrect parameters: `!trivia themes add \"<name>\"`");
                            }
                            addTheme(params[2]);
                            break;

                        case "remove":
                            if(params[2] == null) {
                                channel.sendMessage("Incorrect parameters: `!trivia themes remove <index>`");
                                break;
                            }

                            var themeIndex = params[2];
                            if(data.trivia.length <= themeIndex) {
                                channel.sendMessage("Incorrect index: Run `!trivia themes show` to get an index");
                                break;
                            }

                            channel.sendMessage("I am now removing **" + data.trivia[themeIndex].name + "** from the list of themes.");
                            removeTheme(themeIndex);
                            break;

                        case "show":
                            var themes = "";
                            var themeIndex = -1;
                            data.trivia.forEach(function(theme) {
                                themes += (themes.length > 0 ? "\n" : "") + "`[" + ++themeIndex + "]`" + " **" + theme.name + "**";
                            });

                            channel.sendMessage(themes.length > 0 ? themes : "There are no theme entries yet.");
                            break;

                        default:
                            channel.sendMessage("Incorrect parameters: `!trivia themes <add|remove|show>`");
                            break;
                    }
                    break;

                case "questions":
                    if(params.length < 2) {
                        channel.sendMessage("Incorrect parameters: `!trivia questions <add|remove|show>`");
                        break;
                    }
                    switch(params[1]) {
                        case "add":
                            if(params.length < 5) {
                                channel.sendMessage("Incorrect parameters: `!trivia questions add \"<theme name>\" \"<question>\" \"<answer 1>\" \"[answer 2]\"`");
                                break;
                            }
                            var _theme = params[2];
                            _theme = findTheme(_theme);

                            if(_theme == null) {
                                channel.sendMessage("The **" + params[2] + "** trivia theme does not exist.");
                                break;
                            }

                            var _question = params[3];
                            var _answers = params.slice(4, params.length);
                            addQuestion(_theme, _question, _answers);
                            break;

                        case "remove":
                            if(params.length < 4) {
                                channel.sendMessage("Incorrect parameters: `!trivia questions remove \"<theme name>\" <question index>`");
                                break;
                            }
                            var _theme = params[2];
                            _theme = findTheme(_theme);

                            if(_theme == null) {
                                channel.sendMessage("The **" + params[2] + "** trivia theme does not exist.");
                                break;
                            }

                            removeQuestion(_theme, params[3]);
                            break;

                        case "show":
                            if(params[2] == null) {
                                channel.sendMessage("Incorrect parameters: `!trivia questions show \"<theme name>\" [+|-]` + to show answers.");
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
                                channel.sendMessage("I can't find **" + params[2] + "**.");
                                break;
                            }

                            var questionsList = "";
                            var questionIndex = -1;
                            var showAnswers = params[3] == null ? false : params[3] == "+" ? true : false;
                            themeParam.questions.forEach(function(q) {
                                questionsList += (questionsList.length > 0 ? "\n" : "") + "`[" + ++questionIndex + "]` **" + q.question + "**" + (showAnswers ? "\n" + getAnswers(q.answers) : "" );
                            });

                            channel.sendMessage(themeParam.questions.length > 0 ? questionsList : "There are no questions for **" + params[2] + "**.");
                            break;

                        default:
                            channel.sendMessage("Incorrect parameters: `!trivia questions <add|remove|show>`");
                            break;
                    }
                    break;

                default:
                    channel.sendMessage("Incorrect parameters: `!trivia <themes|questions|play|answer>`");
                    break;
            }
            break;
    }
}


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

exports.getData = function() { return JSON.stringify(data); }