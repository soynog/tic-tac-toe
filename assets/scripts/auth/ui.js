'use strict';

const ttt = require('../game/tictactoe.js');
const app = require('../app-data');
const display = require('../display');
const authApi = require('./api');

const success = (data) => {
  console.log(data);
  console.log(app);
};

const failure = (error) => {
  console.error(error);
};

const signInSuccess = (data) => {
  if (app.user) {
    app.user2 = data.user;
    display.hideAll();
    display.showSections('.add-player-o','.sign-out');
  } else {
    app.user = data.user;
    display.hideAll();
    display.showSections('.create-game','.sign-out');
  }
  console.log(app);
};

const createGameSuccess = (data) => {
  console.log(data);
  app.game = data.game;
  console.log(app);
  display.hideAll();
  display.showSections('.sign-in','.sign-out','.announce');
};

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

const endGameSuccess = (data) => {
  // app.game.cells = data.game.cells;
  app.game.over = data.game.over;
  if(ttt.checkWin(app.game)) {
    let winner = ttt.checkWin(app.game);
    display.announce('Congratulations, Player ' + winner + '! You Win!');
  } else if (ttt.checkFull(app.game)) {
    display.announce('A tie. Womp.');
  }
};

const playSuccess = (data) => {
  console.log("Play PATCH success!");
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
