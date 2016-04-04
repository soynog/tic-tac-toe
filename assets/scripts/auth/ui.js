'use strict';

const app = require('../app-data');
const gameEvents = require('../game/game-events');

const signInSuccess = (data) => {
  if (app.user) {
    app.user2 = data.user;
  } else {
    app.user = data.user;
  }
  console.log(data.user.email + " signed in successfully.");
};

const signOutSuccess = () => {
  app.user = null;
  app.user2 = null;
  app.game = null;
  console.log("User signed out successfully.");
  console.log(app);
};

const newGameSuccess = (data) => {
  console.log(data);
  console.log(app);
  if (data.game) {
    app.game = data.game;
  }
};

const addToGameSuccess = (data) => {
  console.log("Added to Game?");
  console.log(data);
  console.log(app);
};

const success = (data) => {
  console.log(data);
};

const failure = (error) => {
  console.error(error);
};

module.exports = {
  failure,
  success,
  signOutSuccess,
  signInSuccess,
  newGameSuccess,
  addToGameSuccess,
};
