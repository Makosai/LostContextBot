// essentials.js
var fs = require("fs");

// http://stackoverflow.com/questions/10342728/join-array-from-startindex-to-endindex

exports.myJoin = function(seperator, start, end) {
    Array.prototype.myJoin(seperator, start, end);
}

Array.prototype.myJoin = function(seperator, start, end) {
  if (!start) start = 0;
  if (!end) end = this.length - 1;
  end++;
  return this.slice(start, end).join(seperator);
};

// http://stackoverflow.com/a/29016268
exports.checkForFile = function(fileName,callback)
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

exports.splitParams = function(command) {
  let match = null;
  let parts = [];

  while (match = PARAM_REGEX.exec(command)){
    parts.push(match[1] || match[2] || match[0]);
  }
  return parts;
}