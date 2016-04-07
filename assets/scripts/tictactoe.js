'use strict';

const validMove = function (game, index) {
  if (!game.cells[index]) {
    // game.cells[index] = player;
    // $('button#' + index).text(player);
    return true;
  }
  return false;
};

// Check-Win function that takes a board of cells and checks for a win.
const checkWin = function (game) {
  let triplets = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],
                  [1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  let cells = game.cells;
  for (let i in triplets) {
    let t = triplets[i];
    if (cells[t[0]] && cells[t[0]] === cells[t[1]] && cells[t[1]] === cells[t[2]]) {
      return cells[t[0]];
    }
  }
  return false;
};

// Returns true if all of the board is full.
const checkFull = function(game) {
  return game.cells.every(i => i);
};

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

module.exports = {
  checkWin,
  checkFull,
  playTurn,
  validMove,
  turn,
};
