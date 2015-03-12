
(function(exports){

    var CONFIG = {
        COLS: 26,
        ROWS: 26,
        EMPTY: 0,
        SNAKE: 1,
        FRUIT: 2,
        LEFT: 0,
        UP: 1,
        RIGHT: 2,
        DOWN: 3,
        KEY_LEFT: 37,
        KEY_UP: 38,
        KEY_RIGHT: 39,
        KEY_DOWN: 40,
        SPEED: 2
    };

    exports.CONFIG = CONFIG;


})(typeof exports === 'undefined'? this['config']={}: exports);