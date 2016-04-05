'use strict';

// Game Object Constructor (new game)
// const Game = function (playerO, playerX) {
//   this.cells = ['','','','','','','','',''];
//   this.playerX = playerX;
//   this.playerO = playerO;
//   this.over = false;
//   this.turn = 'X';
// };

// Game.prototype place function: adds an o or x to an index. First checks to make sure position is empty. Returns true if successful, false if not.
const validMove = function (game, index, player) {
  if (!game.cells[index]) {
    // game.cells[index] = player;
    // $('button#' + index).text(player);
    return true;
  }
  return false;
};

// Returns an array of index triplets of rows that include the passed index.
// const rows = function(index) {
//   let triplets = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
//   return triplets.filter(trip => trip.some(x => x === Number(index)));
// };

// Game.prototype check win: checks if there are three in a row including the passed index. If there's a winner, return their symbol. If not, return false.
// const checkWin = function (index) {
//   let triplets = rows(index);
//   for (let i in triplets) {
//     let c = this.cells;
//     let t = triplets[i];
//     if (c[t[0]] && c[t[0]] === c[t[1]] && c[t[1]] === c[t[2]]) {
//         return c[t[0]];
//     }
//   }
//   return false;
// };

// Check-Win function that takes a board of cells and checks for a win.
const checkWin = function (game) {
  let triplets = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  let cells = game.cells;
  for (let i in triplets) {
    let t = triplets[i];
    if (cells[t[0]] === cells[t[1]] && cells[t[1]] === cells[t[2]]) {
      return cells[t[0]];
    }
  }
  return false;
};

// Returns true if all of the board is full.
const checkFull = function(game) {
  return game.cells.every(i => i);
};

// Game.prototype turn function: gets user input, makes a place switches whose turn it is, checks win, checks if board is full
// const playTurn = function(index) {
//   if(!this.over) {
//     if(place.call(this,index,this.turn)) {
//       if(checkWin.call(this,index)) {
//         $('.announce').text('Game Over! Player ' + this.turn + ' wins!!!');
//         this.over = true;
//       } else if (checkFull.call(this)) {
//         $('.announce').text("Game Over! It's a tie.");
//         this.over = true;
//       } else {
//         this.turn = this.turn === 'X' ? 'O' : 'X';
//         $('.announce').text("Player " + this.turn + "'s turn.");
//         // Next turn
//       }
//     } else {
//       $('.announce').text("Invalid Move! Try again, player " + this.turn + ".");
//     }
//   }
// };

// Determine player based on # of cells of each type
const turn = function(game) {
  let xs = 0;
  let os = 0;
  for (let i in game.cells) {
    if (game.cells[i] === 'x') {
      xs++;
    } else if (game.cells[i] === 'o') {
      os++;
    }
  }
  return (xs > os) ? 'o' : 'x';
};

// Play turn using a game object passed.
const playTurn = function(game,index) {
  if(!game.over) {
    let player = turn(game);
    if(validMove(game,index,player)) {
      if(checkWin(game)) {
        $('.announce').text('Game Over! Player ' + player + ' wins!!!');
        //game.over = true;
      } else if (checkFull(game)) {
        $('.announce').text("Game Over! It's a tie.");
        //game.over = true;
      } else {
        //this.turn = this.turn === 'X' ? 'O' : 'X';
        $('.announce').text("Player " + player + "'s turn.");
        // Next turn
      }
    } else {
      $('.announce').text("Invalid Move! Try again, player " + player + ".");
    }
  }
};

// Game.prototype end function: ends game, prints a message
//
// Game.prototype.playTurn = playTurn;
// Game.prototype.checkWin = checkWin;
// Game.prototype.place = place;

module.exports = {
  checkWin,
  checkFull,
  playTurn,
  validMove,
  turn,
};
