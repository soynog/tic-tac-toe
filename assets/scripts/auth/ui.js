'use strict';

const Game = require('../game/tictactoe.js');
const app = require('../app-data');
const display = require('../display');

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
  if (data.game) {
    let theGame = new Game();
    app.theGame = theGame;
    app.game = data.game;
  }
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
};

const addPlayerOSuccess = (data) => {
  if (data.game) {
    app.game = data.game;
  }
  display.hideAll();
  display.showSections('.game-board','.announce','.sign-out');
  console.log(data);
  console.log(app);
};

const playSuccess = (data) => {
  console.log("Play PATCH success!");
  console.log(data);
  app.game.cells = data.game.cells;
  app.game.over = data.game.over;
  console.log(app);
};

const success = (data) => {
  console.log(data);
  console.log(app);
};

const failure = (error) => {
  console.error(error);
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
