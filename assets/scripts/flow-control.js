'use strict';

// Display functions for showing various screens:
const disp = require('./display');
const api = require('./api');
const app = require('./app-data');
const ttt = require('./tictactoe');

// Start Screen Display
const startScreen = function() {
  disp.hideAll();
  disp.clearAll();
  app.signOut();
  disp.showSections('.sign-in.user1','.sign-up', '.announce');
  console.log(app);
};

// Game Picker Screen Display
const pickerScreen = function() {
  disp.hideAll();
  disp.clearAll();
  app.clearGame();
  disp.showSections('.create-game','.prev-games','.change-pw','.sign-out');
  api.getGames(
    data => disp.showGameCount(data.games.length),
    error => console.log(error));
  api.getGames(
    data => disp.addPrevGames(data.games),
    error => console.log(error),
    false);
  console.log(app);
};

// Sign in Player 2 Display
const signInUser2 = function() {
  disp.hideAll();
  disp.showSections('.sign-in.user2','.announce','.back-to-picker');
  if (app.game.player_o) {
    let missingPlayer = app.game.player_o.email === app.user.email ?
      app.game.player_x.email : app.game.player_o.email;
    disp.announce("Please sign in " + missingPlayer + ".");
  }
  console.log(app);
};

// Game Screen Display
const gameScreen = function() {
  disp.hideAll();
  disp.updateBoard(app.game.cells);
  disp.announce("Player " + ttt.turn(app.game) + "'s turn.");
  disp.showSections('.game-board','.announce','.back-to-picker','.sign-out');
  console.log(app);
};

module.exports = {
  startScreen,
  pickerScreen,
  signInUser2,
  gameScreen,
};
