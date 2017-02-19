// Import tlibraries
var http = require('http');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('music.db');
var models = require('./models');
// Create a server and provide it a callback to be executed for every HTTP request
// coming into localhost:3000.
var server = http.createServer(function(request, response){
    console.log('Starting... URL = ' +request.url);
    if (request.url === '/playlists' && request.method === 'GET') {
        getPlaylistsHTML(request, response);
    }else if (request.url === '/playlists' && request.method === 'POST') {
        postPlaylist(request, response);
    } else if (request.url === '/library') {
        getLibraryHTML(request, response);
    } else if (request.url === '/search') {
        getSearchHTML(request, response);
    }else if (request.url === '/style') {
        getStylesheet(request, response);
    } else if (request.url === '/') {
        getRedirect(request, response);
    } else if (request.url === '/music-app') {
        getJS(request, response);
    } else if (request.url === '/favicon.ico'){
        //do nothing
    } else if (request.url === '/api/playlists'){
        getPlaylistsJSON(request, response);
    } else if (request.url === '/api/songs'){
        getSongsJSON(request, response);
    } else {
        response.setHeader('Content-Type', 'text/plain');
        console.log('Error: invalid url');
        response.end();
    }
});
    // Start the server on port 3000
server.listen(3000, function() {
console.log('Amazing music app server listening on port 3000!')
});

var getPlaylistsHTML = function(request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    fs.readFile(__dirname + '/playlist.html', function(err, data) {
        if(err != null){console.log(err);}
        response.end(data);
    });
};

var getLibraryHTML = function(request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    fs.readFile(__dirname + '/library.html', function(err, data) {
        if(err != null){console.log(err);}
        response.end(data);
    });
};

var getSearchHTML = function(request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    fs.readFile(__dirname + '/search.html', function(err, data) {
        if(err != null){console.log(err);}
        response.end(data);
    });
};

var getJS = function(request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/javascript');
    fs.readFile(__dirname + '/music-app.js', function(err, data) {
        if(err != null){console.log(err);}
        response.end(data);
    });
};

var postPlaylist = function(request, response) {
    response.statusCode = 200;
    var body = '';
    request.on('data', function(chunk) {
        body += chunk;
    });
    request.on('end', function() {
        console.log("Writing to Playlists...")
        console.log(body);
        fs.writeFile("playlists.json", body, function(err){
            if (err) return console.log(err);
            console.log(body);
            console.log('writing to ' + "playlists.json");
        });
        response.end('Successfully added to DB!');
    });
};

var getStylesheet = function(request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/css');
    fs.readFile(__dirname + '/style.css', function(err, data) {
        response.end(data);
    });
};

var getRedirect = function(request, response) {
    response.statusCode = 301;
    response.setHeader('Location', '/playlists');
    response.end('redirecting to Playlists');
};

var getPlaylistsJSON = function (request, response){
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/JSON');
    models.Playlist.findAll({}).then(function(rows){
        
        response.end(JSON.stringify(rows));
     });
    
}

var getSongsJSON = function (request, response){
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/JSON');
    models.Song.findAll({}).then(function(rows){
        response.end(JSON.stringify(rows));
     });
}

//open('http://localhost.3000/');
