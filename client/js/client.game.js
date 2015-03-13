

(function(exports){

    var Game = function(){
        this.grid = new Grid(CONFIG.EMPTY, CONFIG.COLS, CONFIG.ROWS);
        this.users = {};
        this.inputs = []; // {userId: , keyCode: }
        this.frames = 0;
        this.setFood();
        //this.lastProcessedInputs = {}; // userId: inputId
    };


})(typeof exports === 'undefined'? this['config']={}: exports);