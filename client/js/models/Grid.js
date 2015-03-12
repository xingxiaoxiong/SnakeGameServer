
(function(exports){

    var Grid = function(d, c, r){
        this.width = c;
        this.height = r;
        this._grid = [];
        for (var x=0; x < c; x++) {
            this._grid.push([]);
            for (var y=0; y < r; y++) {
                this._grid[x].push(d);
            }
        }
    };

    Grid.prototype.set = function(val, x, y){
        this._grid[x][y] = val;
    };

    Grid.prototype.get = function(x, y){
        return this._grid[x][y];
    }

    exports.Grid = Grid;


})(typeof exports === 'undefined'? this['config']={}: exports);