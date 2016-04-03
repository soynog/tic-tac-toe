'use strict';

const getFormFields = require('../../../lib/get-form-fields');

// const authApi = require('./api');
// const authUi = require('./ui');

const signInHandlers = () => {
  $('#sign-up').on('submit', function (event) {
    let data = getFormFields(this);
    event.preventDefault();
    console.log(data);
    //authApi.signUp(authUi.success, authUi.failure, data);
  });
  $('#sign-in').on('submit', function (event) {
    let data = getFormFields(this);
    event.preventDefault();
    console.log(data);
    // authApi.signIn(authUi.signInSuccess, authUi.failure, data);
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
