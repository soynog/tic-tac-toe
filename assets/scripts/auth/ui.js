'use strict';

const ttt = require('../game/tictactoe.js');
const app = require('../app-data');
const display = require('../display');
const authApi = require('./api');

// Generic AJAX request success function.
const success = (data) => {
  console.log(data);
  console.log(app);
};

// Generic AJAX request failure function.
const failure = (error) => {
  console.error(error);
};

// If adding a player is successful, redraws display and updates app data.
const addPlayerOSuccess = (data) => {
  if (data.game) {
    app.game = data.game;
  }
  display.hideAll();
  display.showSections('.game-board','.announce','.sign-out');
  display.announce("Player " + ttt.turn(app.game) + "'s turn.");
  console.log(data);
  console.log(app);
};

// If Sign-In is successful, redraws display as appropriate.
const signInSuccess = (data) => {
  if (app.user) {
    // If one player is already signed in, add second player to current game.
    app.user2 = data.user;
    authApi.addPlayerO(addPlayerOSuccess, failure);
  } else {
    app.user = data.user;
    display.hideAll();
    display.showSections('.create-game','.sign-out');
  }
  console.log(app);
};

// If game creation is successful, redraws display and updates app data with game info.
const createGameSuccess = (data) => {
  console.log(data);
  app.game = data.game;
  console.log(app);
  display.hideAll();
  display.showSections('.sign-in','.sign-out','.announce');
};

// If signout is successful, redraws display and clears app data.
const signOutSuccess = () => {
  app.user = null;
  app.user2 = null;
  app.game = null;
  console.log("User signed out successfully.");
  console.log(app);
  display.hideAll();
  display.showSections('.sign-in','.sign-up');
  display.announce('');
};

// If game is updated successful to end it, check endgame type and update app data and display as appropriate.
const endGameSuccess = (data) => {
  app.game.over = data.game.over;
  if(ttt.checkWin(app.game)) {
    let winner = ttt.checkWin(app.game);
    display.announce('Congratulations, Player ' + winner + '! You Win!');
  } else if (ttt.checkFull(app.game)) {
    display.announce('A tie. Womp.');
  }
};

// If a play request is successful, update app data and redraw display as appropriate. Also, check if the play caused a win or a draw and if so update the game again.
const playSuccess = (data) => {
  console.log(data);
  app.game.cells = data.game.cells;
  console.log(app);
  display.updateBoard(app.game.cells);
  display.announce("Player " + ttt.turn(app.game) + "'s turn.");
  if(ttt.checkWin(app.game) || ttt.checkFull(app.game)) {
    authApi.updateGame(endGameSuccess, failure, null, null, true);
  }
};

module.exports = {
  failure,
  success,
  signOutSuccess,
  signInSuccess,
  createGameSuccess,
  addPlayerOSuccess,
  playSuccess,
};
