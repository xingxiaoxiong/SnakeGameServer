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

var snakes = [];
var snake = function(){
    this.direction = null;
    this.last = null;
    this._queue = null; 
};
snake.prototype.start = function(d, x, y) {
        this.direction = d;
        this._queue = [];
        this.insert(x, y);
};

snake.prototype.insert = function(x, y) {
    // unshift prepends an element to an array
    this._queue.unshift({x:x, y:y});
    this.last = this._queue[0];
};

snake.prototype.remove = function() {
    // pop returns the last element of an array
    return this._queue.pop();
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

};

grid.init(EMPTY, COLS, ROWS);

grid.set(FRUIT, 20, 20);



app.use(express.static(path.resolve(__dirname, 'client')));

io.on('connection', function(client) {
    console.log('Client connected...');

    var newSnake = new snake();
    var sp = {x:Math.floor(COLS/2), y:ROWS-1};
    newSnake.start(UP, sp.x, sp.y);
    grid.set(SNAKE, sp.x, sp.y);
    grid.set(FRUIT,1, 1);
    snakes.push(snake);


    client.emit('init', {grid: grid._grid});

    client.on('key', function(data){
        update();
    });
});

server.listen(8080, function(){
    console.log("server is running");
});