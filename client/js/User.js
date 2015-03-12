

(function(exports){

    var User = function(id){
        this.score = 0;
        this.keystate = {};
        this.id = id;
        this.snake = null;
    };

    User.prototype.del = function(){
        this.snake = null;
    };

    User.prototype.assignSnake = function(snake){
        this.snake = snake;
    };

    exports.User = User;


})(typeof exports === 'undefined'? this['config']={}: exports);