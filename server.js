var http = require('http'); //We are creating an HTTP server here
var path = require('path'); //for static file serving
var fs = require('fs');
var readline = require('readline');

var pattern = {
	'/' : 'html'+path.sep+'index.html',
	'/line' : 'html'+path.sep+'line.html'
}

var contentMap = {
	'html' : 'text/html',
	'js' : 'application/javascript',
	'css' : 'text/css',
	'json' : 'application/json'
}


function readFromFile(fileName, response){
	fStreamObj = fs.createReadStream(fileName);
	fStreamObj.pipe(response); //This sorcery saved me hours of slogging further
}

var server = http.createServer(function(request, response){
	var url = request.url;
	var dir = __dirname ;
	ext = url.split('.').pop();
	var routes = Object.keys(pattern);
	if(routes.indexOf(ext) != -1){
		response.writeHead(200, returnHeader(contentMap['html']));
		fileName = pattern[ext];
		fileName = path.join(__dirname, path.sep, fileName);
		console.log(fileName)
		readFromFile(fileName, response);
	}
	else{
		switch(ext){
			case "js" : response.writeHead(200, returnHeader(contentMap[ext]));
									fileName = path.join(__dirname, path.sep, url);
									readFromFile(fileName, response);
									break;
		 case "css" : response.writeHead(200, returnHeader(contentMap[ext]));
									fileName = path.join(__dirname, path.sep, url);
									readFromFile(fileName, response);
									break;
			case "json" : response.writeHead(200, returnHeader(contentMap[ext]));
									fileName = path.join(__dirname, path.sep, url);
									readFromFile(fileName, response);
									break;
			default : response.writeHead(404, returnHeader(contentMap['html']));
								fileName = path.join(__dirname, path.sep, 'html/error.html');
								readFromFile(fileName, response);
								break;
		}
	}
}).listen(8080, function(){
	console.log("Server is listening on port 8080");
});

function returnHeader(type){
	var headerJson = {
		'Content-Type' : type +'; charset=utf-8',
	}
	return headerJson;
}


