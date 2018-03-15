var http = require('http');
var socketio = require('socket.io');
var kolory = require('./lib/kolory');
var mysql = require('mysql');
var fs = require('fs');
var mime = require('mime');
var path = require('path');
var cache = {};
var io;
var root = __dirname;
var html;

var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'kolory'
});

var server_port = 3000;

var server_ip_address = '127.0.0.1';

var server = http.createServer(function (req, res) {
    var filePath = false;
    switch (req.method) {
        case 'POST':
            switch (req.url) {
                case '/':
                    kolory.add(db, req);
                    break;
                case '/delete':
                    kolory.delete(db, req);
                    break;
                case '/deleteAll':
                    kolory.deleteAll(db, req);
                    break;
            }
            var absPath = './' + 'public/index.html';
            serveStatic(res, cache, absPath);
            break;
        case 'GET':
            if (req.url == '/') {
                filePath = 'public/index.html';
            } else {
                filePath = 'public' + req.url;
            }
            var absPath = './' + filePath;
            serveStatic(res, cache, absPath);
            break;
    }

    function serveStatic(res, cache, absPath) {
        if (cache[absPath]) {
            sendFile(res, absPath, cache[absPath]);
        } else {
            fs.exists(absPath, function (exists) {
                if (exists) {
                    fs.readFile(absPath, function (err, data) {
                        if (err) {
                            send404(res);
                        } else {
                            cache[absPath] = data;
                            sendFile(res, absPath, data);
                        }
                    });
                } else {
                    send404(res);
                }
            });
        }
    }

    function sendFile(res, filePath, fileContents) {
        res.writeHead(
            200,
            { "content-type": mime.lookup(path.basename(filePath)) }
        );
        res.end(fileContents);
    }
});

function send404(res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('Błąd 404: plik nie został znaleziony.');
    res.end();
}

server.listen(server_port, server_ip_address);
io = socketio.listen(server);


function tick() {
    var now = new Date().toUTCString();
    kolory.table(db);
    kolory.avarage(db);
    io.emit('time', now);
    io.emit('data', kolory.html);
    io.emit('green', kolory.green);
    io.emit('purple', kolory.purple);
    io.emit('red', kolory.red);
    io.emit('yellow', kolory.yellow);
    io.emit('blue', kolory.blue);
}

setInterval(tick, 100);

db.query(
    "CREATE TABLE IF NOT EXISTS avarage ("
    + "id INT NOT NULL AUTO_INCREMENT, "
    + "red INT NULL, "
    + "purple INT NULL, "
    + "blue INT NULL, "
    + "green INT NULL, "
    + "yellow INT NULL, "
    + "PRIMARY KEY(id))",
    function (err) {
        if (err) throw err;
        console.log('Serwer został uruchomiony...');
    }
);




