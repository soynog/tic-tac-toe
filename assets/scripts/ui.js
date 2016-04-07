'use strict';

const app = require('./app-data');
const api = require('./api');
const flow = require('./flow-control');
const remote = require('../../lib/resource-watcher');

// Generic AJAX request success function.
const success = (data) => {
  console.log(data);
  console.log(app);
};

// Generic AJAX request failure function.
const failure = (error) => {
  console.error(error);
};

// Updates app data with game data and refreshes view.
const watchGameSuccess = (data) => {
  console.log("Watching Game");
  console.log(data);
  app.game = data.game;
  console.log(app);
  flow.gameRefresh();
};

// Create Game Watcher
const createWatcher = function() {
  let gameWatcher = remote.resourceWatcher(
    (app.api + '/games/' + app.game.id + '/watch'),
    {Authorization: 'Token token=' + app.localUsers[0].token}
  );
  gameWatcher.on('change', function (data) {
    console.log("WATCHER SEES CHANGE");
    if (data.timeout) { //not an error
      gameWatcher.close();
      return console.warn(data.timeout);
    } else if (data.game) {
        console.log("Received Game Data");
        console.log(data);
        api.getGame(watchGameSuccess,failure,app.game.id);
    } else {
      console.log(data);
      console.log("thumpTHUMP");
    }
  });

  gameWatcher.on('error', function (e) {
    console.log("WATCHER SEES ERROR");
    console.error('an error has occured with the stream', e);
  });
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
  watchGameSuccess,
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
};
