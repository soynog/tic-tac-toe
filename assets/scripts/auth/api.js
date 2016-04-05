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
    if (app.user && data.credentials.email === app.user.email) {
      console.log(app.user.email + " is already signed in!");
    } else {
      $.ajax({
        method: 'POST',
        url: app.api + '/sign-in',
        data,
      }).done(success)
      .fail(failure);
    }
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

// Updates the gamestate
const updateGame = (success,failure,index,player,gameOver) => {

  console.log("updateGame");
  // console.log(index);
  // console.log(player);
  // console.log(gameOver);

  let data = {
    game: {
      cell: {}
    }
  };

  if (index && player) {
    data.game.cell.index = index;
    data.game.cell.value = player.toLowerCase();
  }

  if (gameOver) {
    data.game.over = gameOver;
  }

  console.log(data);

  $.ajax({
    method: 'PATCH',
    url: app.api + '/games/' + app.game.id,
    headers: {
      Authorization: 'Token token=' + app.user.token,
    },
    data
  }).done(success)
  .fail(failure);
};

module.exports = {
  signUp,
  signIn,
  signOut,
  createGame,
  addPlayerO,
  updateGame,
};
