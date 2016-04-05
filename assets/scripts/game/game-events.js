'use strict';

const Game = require('./tictactoe.js');
let theGame = new Game();

const gameHandlers = () => {
  $('.game-board').click(function(event) {
    if($(event.target).is("button")) {
      theGame.playTurn($(event.target).attr('id'));
    }
  });
};

module.exports = {
  gameHandlers,
};
