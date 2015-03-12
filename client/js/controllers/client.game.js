

(function(exports){

    var gridModule = require('../models/Grid.js');
    var snakeModule = require('../models/Snake.js');
    var userModule = require('../models/User.js');

    var CONFIG = require('../CONFIG.js').CONFIG;

    var Grid = gridModule.Grid;
    var Snake = snakeModule.Snake;
    var snakes = snakeModule.snakes;
    var User = userModule.user();
    var users = userModule.users;

    var Game = function(){
        
        

    };


    exports.Game = Game;


})(typeof exports === 'undefined'? this['config']={}: exports);