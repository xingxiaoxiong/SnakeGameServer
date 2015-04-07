

(function(exports){

    var UUID = require('node-uuid');

    var gridModule = require('./client/js/models/Grid.js');
    var snakeModule = require('./client/js/models/Snake.js');
    var userModule = require('./client/js/models/User.js');

    var CONFIG = require('./client/js/CONFIG.js').CONFIG;

    var Grid = gridModule.Grid;
    var Snake = snakeModule.Snake;
    var User = userModule.User;

    var Game = function(io){
        this.grid = new Grid(CONFIG.EMPTY, CONFIG.COLS, CONFIG.ROWS);
        this.users = {};
        this.inputs = []; // {userId: , keyCode: }
        this.frames = 0;
        this.currentFruit = null;
        this.deltaTime = 0;
        this.now = 0;
        this.scores = {};
        this.io = io;
        this.gameState = {};
        
        this.setFood();
        //this.lastProcessedInputs = {}; // userId: inputId
    };

    Game.prototype.addInput = function(input){
        this.inputs.push(input);
    };

    Game.prototype.removeUser = function(userId){
        delete this.scores[userId];
        var user = this.users[userId];
        this.clearSnake(user.snake);
        user.del();
        delete this.users[userId];
    };

    Game.prototype.setFood = function(){
        var empty = [];
        // iterate through the grid and find all empty cells
        for (var x=0; x < this.grid.width; x++) {
            for (var y=0; y < this.grid.height; y++) {
                if (this.grid.get(x, y) === CONFIG.EMPTY) {
                    empty.push({x:x, y:y});
                }
            }
        }
        // chooses a random cell
        var randpos = empty[Math.round(Math.random()*(empty.length - 1))];
        this.grid.set(CONFIG.FRUIT, randpos.x, randpos.y);
        this.currentFruit = randpos;
    };

    Game.prototype.addNewUser = function(){
        var userId = UUID();
        var newUser = new User(userId);
        var sp = {x:Math.floor(CONFIG.COLS/2), y:CONFIG.ROWS-1};
        newUser.assignSnake(new Snake(CONFIG.UP, sp.x, sp.y));
        this.users[userId] = newUser;
        return userId;        
    };

    Game.prototype.getWorldState = function(){
        return this.grid._grid;
    };

    Game.prototype.clearSnake = function(snake){
        for(var i=0; i<snake._queue.length; ++i){
            this.grid.set(CONFIG.EMPTY, snake._queue[i].x, snake._queue[i].y);
        }
    };

    Game.prototype.update = function(){

        if( this.now == 0){
            this.now = new Date().getTime();
        }else{
            var now = new Date().getTime();
            this.deltaTime += (now - this.now);
            this.now = now;
        }

        if( this.deltaTime > CONFIG.TIME_INTERVAL){
            this.deltaTime -= CONFIG.TIME_INTERVAL;

            for(var i=0; i<this.inputs.length; ++i){
                var input = this.inputs[i];
                var user = this.users[input.userId];
                user.keystate = {};
                user.keystate[input.keyCode] = true;
            }
            this.inputs = [];

            this.gameState = {};
            for(var userId in this.users){
                
                var user = this.users[userId];
                var snake = user.snake;

                if (user.keystate[CONFIG.KEY_LEFT] && snake.direction !== CONFIG.RIGHT) {
                    snake.direction = CONFIG.LEFT;
                }
                if (user.keystate[CONFIG.KEY_UP] && snake.direction !== CONFIG.DOWN) {
                    snake.direction = CONFIG.UP;
                }
                if (user.keystate[CONFIG.KEY_RIGHT] && snake.direction !== CONFIG.LEFT) {
                    snake.direction = CONFIG.RIGHT;
                }
                if (user.keystate[CONFIG.KEY_DOWN] && snake.direction !== CONFIG.UP) {
                    snake.direction = CONFIG.DOWN;
                }

                //console.log(snake._queue);

                var nx = snake.last.x;
                var ny = snake.last.y;
                // updates the position depending on the snake direction
                switch (snake.direction) {
                    case CONFIG.LEFT:
                        nx--;
                        break;
                    case CONFIG.UP:
                        ny--;
                        break;
                    case CONFIG.RIGHT:
                        nx++;
                        break;
                    case CONFIG.DOWN:
                        ny++;
                        break;
                }
                // checks all gameover conditions
                if (0 > nx || nx > this.grid.width-1  ||
                    0 > ny || ny > this.grid.height-1 ||
                    (this.grid.get(nx, ny) != 0) && (this.grid.get(nx, ny) != 2)
                ) {
                    this.clearSnake(snake);
                    var sp = {x:Math.floor(CONFIG.COLS/2), y:CONFIG.ROWS-1};
                    var newSnake = new Snake(CONFIG.UP, sp.x, sp.y);
                    user.assignSnake(newSnake);
                    continue;
                }
                // check wheter the new position are on the fruit item
                if (this.grid.get(nx, ny) === CONFIG.FRUIT) {
                    // increment the score and sets a new fruit position
                    user.score++;
                    var userId = user.id;
                    this.scores[userId] = this.scores[userId] + 1;
                    this.io.sockets.emit('updateScore', {userId: userId, score: this.scores[userId]});
                    this.setFood();

                } else {
                    // take out the first item from the snake queue i.e
                    // the tail and remove id from grid
                    var tail = snake.remove();
                    this.grid.set(CONFIG.EMPTY, tail.x, tail.y);
                }
                // add a snake id at the new position and append it to 
                // the snake queue

                //console.log(user.id);
                this.grid.set(user.id, nx, ny);
                snake.insert(nx, ny);
                
                this.gameState[userId] = snake._queue;
            }

        }
    };


    exports.Game = Game;


})(typeof exports === 'undefined'? this['config']={}: exports);