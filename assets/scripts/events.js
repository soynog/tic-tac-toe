'use strict';

const getFormFields = require('../../lib/get-form-fields');

const authApi = require('./auth/api');
const authUi = require('./auth/ui');
const app = require('./app-data');
const ttt = require('./game/tictactoe');

const signInHandlers = () => {
  $('form.sign-up').on('submit', function (event) {
    let data = getFormFields(this);
    event.preventDefault();
    console.log(data);
    authApi.signUp(authUi.success, authUi.failure, data);
  });
  $('.sign-in').on('submit', function (event) {
    let data = getFormFields(this);
    event.preventDefault();
    authApi.signIn(authUi.signInSuccess, authUi.failure, data);
  });
  $('.sign-out').on('submit', function (event) {
    event.preventDefault();
    authApi.signOut(authUi.signOutSuccess, authUi.failure);
  });
  $('.create-game').on('submit', function (event) {
    event.preventDefault();
    authApi.createGame(authUi.createGameSuccess, authUi.failure);
  });
  $('.add-player-o').on('submit', function(event) {
    event.preventDefault();
    authApi.addPlayerO(authUi.addPlayerOSuccess, authUi.failure);
  });
  $('.show-state').on('click', function(event) {
    event.preventDefault();
    console.log(authUi.success());
  });
};

const gameHandlers = () => {
  $('.game-board').click(function(event) {
    if($(event.target).is("button")) {
      event.preventDefault();
      let index = $(event.target).attr('id');
      // let player = app.theGame.turn.toLowerCase();
      // app.theGame.playTurn(index);
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
