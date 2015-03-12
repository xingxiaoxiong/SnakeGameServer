

(function(exports){

    var User = function(id, client){
        this.score = 0;
        this.keystate = {};
        this.id = id;
        this.client = client;
        this.snake = null;
    };

    User.prototype.del = function(client){
        this.snake = null;
    };

    User.prototype.assignSnake = function(snake){
        this.snake = snake;
    };

    exports.User = User;

})(typeof exports === 'undefined'? this['config']={}: exports);