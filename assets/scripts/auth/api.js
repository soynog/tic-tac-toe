'use strict';

const app = require('../app-data');

// Sign up a new user.
const signUp = (success, failure, data) => {
  $.ajax({
    method: 'POST',
    url: app.api + '/sign-up',
    data,
  }).done(success)
  .fail(failure);
};

// Sign in an existing user.
const signIn = (success, failure, data) => {
  console.log("Signing In");
  $.ajax({
    method: 'POST',
    url: app.api + '/sign-in',
    data,
  }).done(success)
  .fail(failure);
};

const signOut = (success, failure) => {
  // if(!app.user) bad;
  $.ajax({
    method: 'DELETE',
    url: app.api + '/sign-out/' + app.user.id,
    headers: {
      Authorization: 'Token token=' + app.user.token,
    }
  }).done(success)
  .fail(failure);
};

// Create a new game
const createGame = (success, failure) => {
  $.ajax({
    method: 'POST',
    url: app.api + '/games',
    headers: {
      Authorization: 'Token token=' + app.user.token,
    }
  }).done(success)
  .fail(failure);
};

// Add user O to new game
const addToGame = (success,failure) => {
  $.ajax({
    method: 'PATCH',
    url: app.api + '/games/' + app.game.id,
    headers: {
      Authorization: 'Token token=' + app.user2.token,
    }
  }).done(success)
  .fail(failure);
};

// // Create a new game, sign in user O, and add user O to game.
// const newGame = (success1, success2, success3, failure, userOdata) => {
//   $.ajax({
//     method: 'POST',
//     url: app.api + '/games',
//     headers: {
//       Authorization: 'Token token=' + app.user.token,
//     }
//   }).done(success1,
//           signIn(success2,failure,userOdata,
//             addToGame(success3,failure)))
//   .fail(failure);
//   // addToGame(success,failure,app.game.id);
// };

//signIn(success,failure,userOdata,true)

module.exports = {
  signUp,
  signIn,
  signOut,
  createGame,
  addToGame,
};
