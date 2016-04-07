'use strict';

const getFormFields = require('../../lib/get-form-fields');

const api = require('./api');
const ui = require('./ui');
const app = require('./app-data');
const ttt = require('./tictactoe');
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
    if (!app.game) {
      // If no game exists yet, sign in user as primary user and go to picker screen.
      api.signIn(ui.signInSuccess_user1, ui.signInFail, data);
    } else {
      // If a game already exists, determine if a second player is still needed.
      if (!app.game.player_o) {
        // If the game only has one player, sign the user in as player O and add them to the game.
        api.signIn(ui.signInSuccess_user2_add, ui.signInFail, data);
      } else {
        // If the game already has a player O, check to make sure the user signing in matches the correct user, and sign them in (without Adding to the game since they're already added).
        if (data.credentials.email === app.game.player_o.email || data.credentials.email === app.game.player_x.email) {
          api.signIn(ui.signInSuccess_user2, ui.signInFail, data);
        }
      }
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
    if(!app.game) {
      api.createGame(ui.createGameSuccess, ui.failure);
    } else {
      console.log("Game already created!");
    }
  });

  // Join a game by ID
  $('.join-game').on('submit', function (event) {
    event.preventDefault();
    let id = getFormFields(this).id;
    console.log(id);
    api.joinGame(ui.addPlayerOSuccess,ui.failure,id);
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
      let playTurn = ttt.turn(app.game);
      console.log("MyTurn function: " + app.myTurn(playTurn));
      // Before Updating: Check if game is live, the current player is signed in on this computer, and the move is valid.
      if( !app.game.over &&
          app.myTurn(playTurn) &&
          ttt.validMove(app.game,index)) {
        api.updateGame(ui.playSuccess,ui.failure, index, playTurn, false);
      }
    }
  });
};

module.exports = {
  signInHandlers,
  gameHandlers,
};
