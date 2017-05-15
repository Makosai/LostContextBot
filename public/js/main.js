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