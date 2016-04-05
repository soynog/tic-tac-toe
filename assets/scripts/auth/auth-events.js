'use strict';

const getFormFields = require('../../../lib/get-form-fields');

const authApi = require('./api');
const authUi = require('./ui');

const signInHandlers = () => {
  $('.sign-up').on('submit', function (event) {
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
    authApi.addToGame(authUi.addPlayerOSuccess, authUi.failure);
  });
  $('.show-state').on('click', function(event) {
    event.preventDefault();
    console.log(authUi.success());
  });
};

// const addHandlers = () => {
//   $('#sign-out').on('submit', function (event) {
//     event.preventDefault();
//     authApi.signOut(authUi.signOutSuccess, authUi.failure);
//   });
// };

module.exports = {
  signInHandlers,
};
