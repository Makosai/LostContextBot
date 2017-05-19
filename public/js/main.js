// Site Configuration
var site = {
    title: "Lost Context"
};


// Core
function getTitle(page) {
    return "<title>" + site.title + " - " + page + "</title>";
}

function getIncludes(page) {
    var title = getTitle(page);
    return title + `
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

<link rel="stylesheet" href="/css/main.css">

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="/css/bootstrap.min.css">

<!-- Optional theme -->
<link rel="stylesheet" href="/css/bootstrap-theme.min.css">
    `;
}

function getPostIncludes(page) {
    return `
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="/js/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="/js/bootstrap.min.js"></script>
    `;
}


// HTML Creation
function createButton(name, link) {
    return `
<div class="buttonContainer">
    <div class="button">
        <a href="` + link + `" role="button" type="button" class="btn btn-info btn-circle btn-xl">
        <span class="glyphicon-discord"></span></a>
    </div>
    <div class="text">` + name + `</div>
</div>
    `;
}

function initTriviaButtons() {
    var htmlData = "";
    var triviaText = document.getElementById("trivia");

    for(var i = 0; i < triviaData.trivia.length; i++) {
        // Themes List
        triviaText.innerHTML += '<div class="triviaTheme">\n';
        
        // Theme Name
        triviaText.innerHTML += '<div class="name">' + triviaData.trivia[i].name + '</div>\n';
        
        // Questions List
        triviaText.innerHTML += '<div class="questions">\n'
        
        triviaData.trivia[i].questions.forEach(function(question) {
            // Question Name
            triviaText.innerHTML += '<div class="question">' + question.question + '</div>';
            
            // Answers List
            triviaText.innerHTML += '<div class="answers">';
            
            question.answers.forEach(function(answer) {
                // Answer Name
                triviaText.innerHTML += '<div class="answer">' + answer + '</div>'; 
            });
            
            triviaText.innerHTML += '</div>';
        });
        
        triviaText.innerHTML += '</div>';
        
        triviaText.innerHTML += '</div>';
        
/*        htmlData += `
<div class="triviaTheme">
    <div class="name">` + triviaData.trivia[i].name + `</div>
    <div class="questions>
        ` + triviaData.trivia[i].questions.forEach(function(question) {
            return `
            <div class="question">` + question.question + `</div>
            <div class="answers>
                `+ question.answers.forEach(function(answer) {
                return '<div class="answer">' + answer + '</div>'
            }) + `
            </div>
`
        }) + `
    </div>
</div>
`; */
    }
}