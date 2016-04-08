'use strict';

const app = require('./app-data');
const api = require('./api');
const flow = require('./flow-control');
const createWatcher = require('./game-watcher');

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
  console.log("Adding Player O");
  console.log(app);
  if (app.isRemote()) {
    createWatcher();
  }
};

// If game already has 2 players, join it like a previous game. Otherwise, add player O and join it.
const joinRemoteSuccess = (data) => {
  console.log("Join Remote Successful");
  if (data.game.player_o) {   // If game already has a player O...
    console.log("Joining existing game");
    app.game = data.game;
    console.log(app);
    flow.gameScreen();
    if (app.isRemote()) {
      createWatcher();
    }
  } else { // If there isn't a player O, add current player.
    let id = data.game.id;
    let token = app.localUsers[0].token;
    console.log("Joining new remote game. Calling addPlayerO with " + id + " and " + token + ".");
    api.addPlayerO(addPlayerOSuccess,failure,id,token);
  }
};

// If game successfully opens, update game data to match retreived game and open Player 2 Signin Screen
const openGameSuccess = (data) => {
  app.game = data.game;
  flow.signInUser2();
};

// If User 1 Sign-In is successful, update app-data and go to Picker Screen.
const signInSuccess_user1 = (data) => {
  app.localUsers.push(data.user);
  console.log("Pushing User 1");
  console.log(app);
  flow.pickerScreen();
};

// If User 2 Sign-In is successful, update app-data and add Player O.
const signInSuccess_user2_add = (data) => {
  app.localUsers.push(data.user);
  console.log("Pushing User 2");
  console.log(app);
  api.addPlayerO(addPlayerOSuccess, failure);
};

// If User 2 Sign-In is successful, update app-data only.
const signInSuccess_user2 = (data) => {
  app.localUsers.push(data.user);
  console.log("Pushing User 2");
  console.log(app);
  flow.gameScreen();
};

// If Sign-In Fails, tell user to enter a valid username and password.
const signInFail = () => {
  flow.pickerScreen("Please enter a valid username and password.");
};

// If game creation is successful, update app data and show signInUser2 Screen.
const createHotseatSuccess = (data) => {
  app.game = data.game;
  flow.signInUser2();
};

// If game creation is successful, go directly to game screen.
const createRemoteSuccess = (data) => {
  app.game = data.game;
  flow.gameScreen("Waiting for a remote player to sign in...");
  createWatcher();
};

// If signout is successful, clear app data and go to Start Screen.
const signOutSuccess = () => {
  flow.startScreen();
};

// If a play request is successful, update app data and refresh the game board. Also, check if the play caused a win or a draw and if so update the game again.
const playSuccess = (data) => {
  app.game.cells = data.game.cells;
  flow.gameRefresh();
};

// If a password change request is successful, return to game picker screen.
const changePWSuccess = () => {
  flow.pickerScreen("Change Password Success!");
};

module.exports = {
  failure,
  success,
  signOutSuccess,
  signInSuccess_user1,
  signInSuccess_user2,
  signInSuccess_user2_add,
  signInFail,
  createHotseatSuccess,
  createRemoteSuccess,
  addPlayerOSuccess,
  playSuccess,
  changePWSuccess,
  openGameSuccess,
  joinRemoteSuccess,
};
