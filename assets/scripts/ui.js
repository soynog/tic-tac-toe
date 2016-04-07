'use strict';

const ttt = require('./tictactoe.js');
const app = require('./app-data');
const disp = require('./display');
const api = require('./api');
const flow = require('./flow-control');

// Generic AJAX request success function.
const success = (data) => {
  console.log(data);
  console.log(app);
};

// Generic AJAX request failure function.
const failure = (error) => {
  console.error(error);
};

// If adding a player is successful, update app-data and go to Game Screen
const addPlayerOSuccess = (data) => {
  if (data.game) {
    app.game = data.game;
  }
  flow.gameScreen();
};

// If game successfully opens, update game data to match retreived game and open Player 2 Signin Screen
const openGameSuccess = (data) => {
  app.game = data.game;
  flow.signInUser2();
};

// If User 1 Sign-In is successful, update app-data and go to Picker Screen.
const signInSuccess_user1 = (data) => {
  app.user = data.user;
  flow.pickerScreen();
};

// If User 2 Sign-In is successful, update app-data and add Player O.
const signInSuccess_user2_add = (data) => {
  app.user2 = data.user;
  api.addPlayerO(addPlayerOSuccess, failure);
};

// If User 2 Sign-In is successful, update app-data only.
const signInSuccess_user2 = (data) => {
  app.user2 = data.user;
  flow.gameScreen();
};

// If Sign-In Fails, tell user to enter a valid username and password.
const signInFail = () => {
  disp.announce("Please enter a valid username and password.");
};

// If game creation is successful, update app data and show signInUser2 Screen.
const createGameSuccess = (data) => {
  app.game = data.game;
  flow.signInUser2();
};

// If signout is successful, clear app data and go to Start Screen.
const signOutSuccess = () => {
  flow.startScreen();
};

// If game is updated successful to end it, check endgame type and update app data and display as appropriate.
const endGameSuccess = (data) => {
  app.game.over = data.game.over;
  if(ttt.checkWin(app.game)) {
    let winner = ttt.checkWin(app.game);
    disp.announce('Congratulations, Player ' + winner + '! You Win!');
  } else if (ttt.checkFull(app.game)) {
    disp.announce('A tie. Womp.');
  }
};

// If a play request is successful, update app data and redraw disp as appropriate. Also, check if the play caused a win or a draw and if so update the game again.
const playSuccess = (data) => {
  app.game.cells = data.game.cells;
  disp.updateBoard(app.game.cells);
  if(ttt.checkWin(app.game) || ttt.checkFull(app.game)) {
    api.updateGame(endGameSuccess, failure, null, null, true);
  } else {
    disp.announce("Player " + ttt.turn(app.game) + "'s turn.");
  }
};

// If a password change request is successful, return to game picker screen.
const changePWSuccess = () => {
  disp.announce("Change Password Success!");
  flow.pickerScreen();
};

module.exports = {
  failure,
  success,
  signOutSuccess,
  signInSuccess_user1,
  signInSuccess_user2,
  signInSuccess_user2_add,
  signInFail,
  createGameSuccess,
  addPlayerOSuccess,
  playSuccess,
  changePWSuccess,
  openGameSuccess,
};
