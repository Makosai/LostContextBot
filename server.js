//Lets require/import the HTTP module
var http = require('http');
var url = require("url");
var path = require("path");
var fs = require("fs");

const main = require("./main.js");

const ROOT = "public/";

//Lets define a port we want to listen to
const PORT = 1337; 

function handleGet(request, response) {
    /*var body = [];
    request.on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        body = Buffer.concat(body).toString();
        response.end(body);
    }) */
    
    var url_parts = url.parse(request.url, true);
    
    /// Fix your shit, the paths are bad and messy
    if(url_parts.pathname.substr(0, "/trivia".length) === "/trivia") {
        var query = url_parts.query;
        console.log(url_parts);
        console.log(query);
        
        if(query.call == "trivia") {
            if(query.param0 != undefined && query.param1 != undefined && query.param2 != undefined) {
                console.log(1);
                if(main.getLastMessage() == null) {
                    console.log("Bot not properly initialized.");
                    return;
                }
                
                var params = [query.param0, query.param1, query.param2];
                main.trivia.run(query.call, params, main.getLastMessage());
            }
        }
    }
}

//We need a function which handles requests and send response
function handleRequest(request, response) {
    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), ROOT + uri);
    console.log(filename);
    
    if(request.method === 'GET') {
        handleGet(request, response);
    }

    var contentTypesByExtension = {
    '.html': "text/html",
    '.css':  "text/css",
    '.js':   "text/javascript"
    };

    fs.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if(fs.statSync(filename).isDirectory())
            filename += 'index.html';

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {        
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            var headers = {};
            var contentType = contentTypesByExtension[path.extname(filename)];
            if (contentType)
                headers["Content-Type"] = contentType;
            response.writeHead(200, headers);
            response.write(file, "binary");
            response.end();
        });
    });
    
    //response.end('It Works!! Path Hit: ' + request.url);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function() {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

exports.getVar = function(variable) {
    switch(variable) {
        case "http":
            return http;
        
        case "PORT":
            return PORT;

        case "handleRequest()":
            return handleRequest();

        case "server":
            return server;
    }
}