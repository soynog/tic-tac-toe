'use strict';

const getFormFields = require('../../lib/get-form-fields');

const authApi = require('./auth/api');
const authUi = require('./auth/ui');
const app = require('./app-data');
const ttt = require('./game/tictactoe');

const signInHandlers = () => {
  // Create a new user
  $('form.sign-up').on('submit', function (event) {
    let data = getFormFields(this);
    event.preventDefault();
    console.log(data);
    authApi.signUp(authUi.success, authUi.failure, data);
  });

  // Sign in an existing user
  $('.sign-in').on('submit', function (event) {
    let data = getFormFields(this);
    event.preventDefault();
    authApi.signIn(authUi.signInSuccess, authUi.failure, data);
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
