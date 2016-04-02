'use strict';

// Game Object Constructor (new game)
const Game = function (playerO, playerX) {
  this.cells = ['','','','','','','','',''];
  this.playerX = playerX;
  this.playerO = playerO;
  this.over = false;
  this.turn = 'x';
};

// Game.prototype place function: adds an o or x to an index. First checks to make sure position is empty. Returns true if successful, false if not.
const place = function (index, player) {
  if (!this.cells[index]) {
    this.cells[index] = player;
    return true;
  }
  return false;
};

// Returns an array of index triplets of rows that include the passed index.
const rowsThruInd = function(index) {
  const triplets = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return triplets.filter(trip => trip.some(x => x === index));
};

// Game.prototype check win: checks if there are three in a row including the passed index. If there's a winner, return their symbol. If not, return false.
const checkWin = function (index) {
  let triplets = rowsThruInd(index);
  for (let i in triplets) {
    let c = this.cells;
    let t = triplets[i];
    if (c[t[0]] && c[t[0]] === c[t[1]] && c[t[1]] === c[t[2]]) {
        return c[t[0]];
    }
  }
  return false;
};

// Returns true if all of the board is full.
const checkFull = function() {
  return this.cells.every(i => i);
};

// Game.prototype turn function: gets user input, makes a place switches whose turn it is, checks win, checks if board is full
const playTurn = function(index) {
  if(place.call(this,index,this.turn)) {
    if(checkWin.call(this,index)) {
      console.log('Game Over! Player ' + this.turn + ' wins!!!');
    } else if (checkFull.call(this)) {
      console.log("Game Over! It's a tie.");
    } else {
      this.turn = this.turn === 'x' ? 'o' : 'x';
      console.log(this.cells);
      // Next turn
    }
  } else {
    console.log("Invalid Move! Try again.");
  }
};

// Game.prototype end function: ends game, prints a message


Game.prototype.playTurn = playTurn;

module.exports = Game;
