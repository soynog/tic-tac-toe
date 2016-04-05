'use strict';

const app = require('../app-data');

// Sign up a new user.
const signUp = (success, failure, data) => {
  if (data) {
    $.ajax({
      method: 'POST',
      url: app.api + '/sign-up',
      data,
    }).done(success)
    .fail(failure);
  } else {
    console.log("No data!");
  }
};

// Sign in an existing user.
const signIn = (success, failure, data) => {
  console.log("Signing In");
  if (data) {
    $.ajax({
      method: 'POST',
      url: app.api + '/sign-in',
      data,
    }).done(success)
    .fail(failure);
  } else {
    console.log("No data!");
  }
};

const signOut = (success, failure) => {
  if (app.user) {
    $.ajax({
      method: 'DELETE',
      url: app.api + '/sign-out/' + app.user.id,
      headers: {
        Authorization: 'Token token=' + app.user.token,
      }
    }).done(success)
    .fail(failure);
  } else {
    console.log("No user to sign out...");
  }
};

// Create a new game
const createGame = (success, failure) => {
  if (!app.game) {
    $.ajax({
      method: 'POST',
      url: app.api + '/games',
      headers: {
        Authorization: 'Token token=' + app.user.token,
      }
    }).done(success)
    .fail(failure);
  } else {
    console.log("Game already created!");
  }
};

// Add user O to new game
const addPlayerO = (success,failure) => {
  if (app.game && app.user2) {
    $.ajax({
      method: 'PATCH',
      url: app.api + '/games/' + app.game.id,
      headers: {
        Authorization: 'Token token=' + app.user2.token,
      }
    }).done(success)
    .fail(failure);
  } else {
    console.log("Need a game and a second user to add!");
  }
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
  addPlayerO,
};
