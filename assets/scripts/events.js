'use strict';

const getFormFields = require('../../lib/get-form-fields');

const authApi = require('./auth/api');
const authUi = require('./auth/ui');
const app = require('./app-data');
const ttt = require('./game/tictactoe');
const display = require('./display');

const signInHandlers = () => {
  // Create a new user
  $('.sign-up').on('submit', function (event) {
    let data = getFormFields(this);
    event.preventDefault();
    console.log(data);
    authApi.signUp(authUi.success, authUi.failure, data);
  });

  // Sign in an existing user
  $('.sign-in').on('submit', function (event) {
    let data = getFormFields(this);
    event.preventDefault();
    if (app.game) {
      if (data.credentials.email === app.game.player_o.email) {
        authApi.signIn(authUi.addPlayerOSuccess, authUi.signInFail, data);
      } else {
        display.announce("Please sign in as " + app.game.player_o.email + ".");
      }
    } else {
      authApi.signIn(authUi.signInSuccess, authUi.signInFail, data);
    }
  });

  // Sign out of current user
  $('.sign-out').on('submit', function (event) {
    event.preventDefault();
    authApi.signOut(authUi.signOutSuccess, authUi.failure);
  });

  // Start a new game
  $('.create-game').on('submit', function (event) {
    event.preventDefault();
    authApi.createGame(authUi.createGameSuccess, authUi.failure);
  });

  // Open an incomplete gameHandlers
  $('.prev-games').click(function(event) {
    event.preventDefault();
    if($(event.target).is("button")) {
      let gameId = $(event.target).text();
      // Login player O

      authApi.getGame(authUi.openGameSuccess, authUi.failure, gameId);

    }
  });

  // Change User Password
  $('.change-pw').on('submit', function (event) {
    let data = getFormFields(this);
    event.preventDefault();
    authApi.changePW(authUi.changePWSuccess, authUi.failure, data);
  });
};

const gameHandlers = () => {
  // Clicking on a game square triggers game logic for placing on that square.
  $('.game-board').click(function(event) {
    if($(event.target).is("button")) {
      event.preventDefault();
      let index = $(event.target).attr('id');
      if(!app.game.over && ttt.validMove(app.game,index)) {
        authApi.updateGame(authUi.playSuccess,authUi.failure, index, ttt.turn(app.game), false);
      }
    }
  });
};

module.exports = {
  signInHandlers,
  gameHandlers,
};
