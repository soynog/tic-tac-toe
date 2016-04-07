'use strict';

const getFormFields = require('../../lib/get-form-fields');

const api = require('./api');
const ui = require('./ui');
const app = require('./app-data');
const ttt = require('./tictactoe');
const disp = require('./display');
const flow = require('./flow-control');

const signInHandlers = () => {
  // Create a new user
  $('.sign-up').on('submit', function (event) {
    let data = getFormFields(this);
    event.preventDefault();
    api.signUp(ui.success, ui.failure, data);
  });

  // Sign in an existing user
  $('.sign-in').on('submit', function (event) {
    event.preventDefault();
    let data = getFormFields(this);
    if (app.user && data.credentials.email === app.user.email) {
      // If User is already signed in, tell them that and do nothing.
      disp.announce(app.user.email + " is already signed in!");
    } else if (app.game) {
      // If a game exists already...
      if(app.game.player_o) {
        //...and it already has a player O...
        if (data.credentials.email === app.game.player_o.email) {
          // ...and the user has entered in the right credentials for that player, sign in that player.
          api.signIn(ui.addPlayerOSuccess, ui.signInFail, data);
        }
      } else {
        // if there is game but no player O, sign the player in as player O.
        api.signIn(ui.signInSuccess_user2, ui.signInFail, data);
      }
    } else {
      // If no game exists already, sign the player in as primary player.
      api.signIn(ui.signInSuccess_user1, ui.signInFail, data);
    }
  });

  // Sign out of current user
  $('.sign-out').on('submit', function (event) {
    event.preventDefault();
    api.signOut(ui.signOutSuccess, ui.failure);
  });

  // Start a new game
  $('.create-game').on('submit', function (event) {
    event.preventDefault();
    api.createGame(ui.createGameSuccess, ui.failure);
  });

  // Open an incomplete gameHandlers
  $('.prev-games').click(function(event) {
    event.preventDefault();
    if($(event.target).is("button")) {
      let gameId = $(event.target).text();
      // Login player O
      api.getGame(ui.openGameSuccess, ui.failure, gameId);
    }
  });

  // Change User Password
  $('.change-pw').on('submit', function (event) {
    let data = getFormFields(this);
    event.preventDefault();
    api.changePW(ui.changePWSuccess, ui.failure, data);
  });

  // Back to game picker
  $('.back-to-picker').on('submit', function (event) {
    event.preventDefault();
    flow.pickerScreen();
  });
};

const gameHandlers = () => {
  // Clicking on a game square triggers game logic for placing on that square.
  $('.game-board').click(function(event) {
    if($(event.target).is("button")) {
      event.preventDefault();
      let index = $(event.target).attr('id');
      if(!app.game.over && ttt.validMove(app.game,index)) {
        api.updateGame(ui.playSuccess,ui.failure, index, ttt.turn(app.game), false);
      }
    }
  });
};

module.exports = {
  signInHandlers,
  gameHandlers,
};
