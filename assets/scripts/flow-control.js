'use strict';

// Display functions for showing various screens:
const disp = require('./display');
const api = require('./api');
const app = require('./app-data');
const ttt = require('./tictactoe');

// Start Screen Display
const startScreen = function() {
  disp.hideAll();
  disp.clearAll(true);
  disp.showSections('.sign-in.user1','.sign-up', '.announce');
};

// Game Picker Screen Display
const pickerScreen = function() {
  disp.hideAll();
  disp.clearAll();
  disp.showSections('.create-game','.prev-games','.change-pw','.sign-out');
  api.getGames(
    data => disp.showGameCount(data.games.length),
    error => console.log(error));
  api.getGames(
    data => disp.addPrevGames(data.games),
    error => console.log(error),
    false);
};

// Sign in Player 2 Display
const signInUser2 = function() {
  disp.hideAll();
  disp.showSections('.sign-in.user2','.announce','.back-to-picker');
  if (app.game.player_o) {
    disp.announce("Please sign in " + app.game.player_o.email + ".");
  }
};

// Game Screen Display
const gameScreen = function() {
  disp.hideAll();
  disp.updateBoard(app.game.cells);
  disp.announce("Player " + ttt.turn(app.game) + "'s turn.");
  disp.showSections('.game-board','.announce','.back-to-picker','.sign-out');
};

module.exports = {
  startScreen,
  pickerScreen,
  signInUser2,
  gameScreen,
};
