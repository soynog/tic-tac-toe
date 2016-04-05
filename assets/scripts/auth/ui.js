'use strict';

const app = require('../app-data');

const signInSuccess = (data) => {
  if (app.user) {
    app.user2 = data.user;
  } else {
    app.user = data.user;
  }
  console.log(data.user.email + " signed in successfully.");
  console.log(app);
};

const signOutSuccess = () => {
  app.user = null;
  app.user2 = null;
  app.game = null;
  console.log("User signed out successfully.");
  console.log(app);
};

const createGameSuccess = (data) => {
  console.log(data);
  if (data.game) {
    app.game = data.game;
  }
  console.log(app);
};

const addPlayerOSuccess = (data) => {
  if (data.game) {
    app.game = data.game;
  }
  console.log(data);
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
};
