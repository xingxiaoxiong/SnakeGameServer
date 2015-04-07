var path = require('path');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var gameModule = require('./server.game.js');
var Game = gameModule.Game;

var CONFIG = require('./client/js/CONFIG.js').CONFIG;

var game = new Game(io);

app.use(express.static(path.resolve(__dirname, 'client')));

io.on('connection', function(client) {
    console.log('Client connected...');

    client.userId = game.addNewUser();

    game.scores[client.userId] = 0;

    client.emit('init', {grid: game.grid._grid, userId: client.userId, scores: game.scores, fruit: game.currentFruit});

    client.broadcast.emit('addMe', client.userId);

    client.on('keydown', function(data){
        game.addInput({userId: client.userId, keyCode: data.keyCode});
    });

    client.on('disconnect', function() {
        console.log(client.userId + " disconnected");

        client.broadcast.emit('removeMe', client.userId);

        game.removeUser(client.userId);
    });

    setInterval(function(){
        game.update();
        client.emit('update', {gameState: game.gameState, fruit: game.currentFruit}); 
    }, 15);
});



server.listen(8000, function(){
    console.log("server is running");
});