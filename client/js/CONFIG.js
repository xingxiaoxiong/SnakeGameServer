
(function(exports){

    var CONFIG = {
        COLS: 36,
        ROWS: 36,
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
        TIME_INTERVAL: 100
    };

    exports.CONFIG = CONFIG;


})(typeof exports === 'undefined'? this['config']={}: exports);