

(function(exports){

    var Snake = function(d, x, y){
        this.direction = d;
        this._queue = [];
        this.insert(x, y);
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

    exports.Snake = Snake;

})(typeof exports === 'undefined'? this['config']={}: exports);