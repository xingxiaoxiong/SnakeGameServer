var path = require('path');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


var
COLS = 26,
ROWS = 26,
EMPTY = 0,
SNAKE = 1,
FRUIT = 2,
LEFT  = 0,
UP    = 1,
RIGHT = 2,
DOWN  = 3,
KEY_LEFT  = 37,
KEY_UP    = 38,
KEY_RIGHT = 39,
KEY_DOWN  = 40;

var frames = 0;

snakeId = 0;
userId = 0;
/*  Snake model  */
var snakes = {};
var Snake = function(){
    this.direction = null;
    this.last = null;
    this._queue = null; 
    this.id = null;
    this.userId = null;
};
Snake.prototype.init = function(d, x, y) {
    this.direction = d;
    this._queue = [];
    this.insert(x, y);
    this.id = ++snakeId;
    snakes[this.id] = this;
};

Snake.prototype.insert = function(x, y) {
    // unshift prepends an element to an array
    this._queue.unshift({x:x, y:y});
    this.last = this._queue[0];
};

Snake.prototype.remove = function() {
    // pop returns the last element of an array
    return this._queue.pop();
};

/* User Model */
var users = {};
var User = function(){
    this.score = 0;
    this.keystate = {};
    this.id;
}
User.prototype.init = function(){
    this.id = ++userId;
    var newSnake = new Snake();
    var sp = {x:Math.floor(COLS/2), y:ROWS-1};
    newSnake.init(UP, sp.x, sp.y);
    newSnake.userId = this.id;
    users[this.id] = this;
};



var grid = {
    width: null,  /* number, the number of columns */
    height: null, /* number, the number of rows */
    _grid: null,  /* Array<any>, data representation */

    init: function(d, c, r) {
        this.width = c;
        this.height = r;
        this._grid = [];
        for (var x=0; x < c; x++) {
            this._grid.push([]);
            for (var y=0; y < r; y++) {
                this._grid[x].push(d);
            }
        }
    },

    set: function(val, x, y) {
        this._grid[x][y] = val;
    },

    get: function(x, y) {
        return this._grid[x][y];
    }
};



var setFood = function () {
    var empty = [];
    // iterate through the grid and find all empty cells
    for (var x=0; x < grid.width; x++) {
        for (var y=0; y < grid.height; y++) {
            if (grid.get(x, y) === EMPTY) {
                empty.push({x:x, y:y});
            }
        }
    }
    // chooses a random cell
    var randpos = empty[Math.round(Math.random()*(empty.length - 1))];
    grid.set(FRUIT, randpos.x, randpos.y);
}

var update = function(){
    

    for (var snakeId in snakes) {

        if (snakes.hasOwnProperty(snakeId)) {

            var snake = snakes[snakeId];

            var userId = snakes[snakeId].userId + '';
            var user = users[userId];

            // console.log(users);
            // console.log(snake);
            // console.log(user);

            if (user.keystate[KEY_LEFT] && snake.direction !== RIGHT) {
                snake.direction = LEFT;
            }
            if (user.keystate[KEY_UP] && snake.direction !== DOWN) {
                snake.direction = UP;
            }
            if (user.keystate[KEY_RIGHT] && snake.direction !== LEFT) {
                snake.direction = RIGHT;
            }
            if (user.keystate[KEY_DOWN] && snake.direction !== UP) {
                snake.direction = DOWN;
            }

            // pop the last element from the snake queue i.e. the
            // head
            var nx = snake.last.x;
            var ny = snake.last.y;
            // updates the position depending on the snake direction
            switch (snake.direction) {
                case LEFT:
                    nx--;
                    break;
                case UP:
                    ny--;
                    break;
                case RIGHT:
                    nx++;
                    break;
                case DOWN:
                    ny++;
                    break;
            }
            // checks all gameover conditions
            if (0 > nx || nx > grid.width-1  ||
                0 > ny || ny > grid.height-1 ||
                grid.get(nx, ny) === SNAKE
            ) {
                continue;
            }
            // check wheter the new position are on the fruit item
            if (grid.get(nx, ny) === FRUIT) {
                // increment the score and sets a new fruit position
                user.score++;
                setFood();
            } else {
                // take out the first item from the snake queue i.e
                // the tail and remove id from grid
                var tail = snake.remove();
                grid.set(EMPTY, tail.x, tail.y);
            }
            // add a snake id at the new position and append it to 
            // the snake queue
            grid.set(SNAKE, nx, ny);
            snake.insert(nx, ny);
        }
    }

};

grid.init(EMPTY, COLS, ROWS);
setFood();


app.use(express.static(path.resolve(__dirname, 'client')));

io.on('connection', function(client) {
    console.log('Client connected...');

    var user = new User(); 
    user.init();   

    client.emit('init', {grid: grid._grid, userId: user.id});

    client.on('keydown', function(data){
        var user = users[data.userId];
        user.keystate = {};
        user.keystate[data.keyCode] = true;
    });

    // client.on('keyup', function(data){
    //     delete keystate[keyCode];
    // });

    setInterval(function(){
        update();
        client.emit('update', {grid: grid._grid}); 
    }, 350);
});



server.listen(8000, function(){
    console.log("server is running");
});