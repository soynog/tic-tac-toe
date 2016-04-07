'use strict';

const app = require('./app-data');
// const display = require('../display');

// Sign up a new user.
const signUp = (success, failure, data) => {
  console.log("Signing Up");
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

// Get list of games played by user.
const getGames = (success, failure, over) => {
  let url = app.api + '/games' + (over !== undefined ? '/?over=' + String(over) : '');
  $.ajax({
    method: 'GET',
    url,
    headers: {
      Authorization: 'Token token=' + app.user.token,
    }
  }).done(success)
  .fail(failure);
};

// Get a game based on its ID.
const getGame = (success, failure, id) => {
  $.ajax({
    method: 'GET',
    url: app.api + '/games/' + id,
    headers: {
      Authorization: 'Token token=' + app.user.token,
    }
  }).done(success)
  .fail(failure);
};

// Sign out of current user.
const signOut = (success, failure) => {
  console.log("Signing Out");
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

// Create a new game.
const createGame = (success, failure) => {
  console.log("Creating a new game");
  $.ajax({
    method: 'POST',
    url: app.api + '/games',
    headers: {
      Authorization: 'Token token=' + app.user.token,
    }
  }).done(success)
  .fail(failure);
};

// Add player O to the new game.
const addPlayerO = (success,failure) => {
  $.ajax({
    method: 'PATCH',
    url: app.api + '/games/' + app.game.id,
    headers: {
      Authorization: 'Token token=' + app.user2.token,
    }
  }).done(success)
  .fail(failure);
};

// Updates the gamestate based on a recent play.
const updateGame = (success,failure,index,player,gameOver) => {
  console.log("Updating game");

  let data = {
    game: {
      cell: {}
    }
  };

  if (index && player) {
    data.game.cell.index = index;
    data.game.cell.value = player;
  }

  if (gameOver) {
    data.game.over = gameOver;
  }

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

const changePW = (success, failure, formData) => {
  console.log("Changing password");
  let data = {
    passwords: {}
  };
  if (formData.passwords) {
    data.passwords.new = formData.passwords.new;
    data.passwords.old = formData.passwords.old;
  }
  $.ajax({
    method: 'PATCH',
    url: app.api + '/change-password/' + app.user.id,
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
  changePW,
  getGames,
  getGame,
};
