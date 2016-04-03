'use strict';

// Displays Sign In and Sign Up Screen
const loginScreen = function() {
  $('#login-screen').removeClass('hide');
  $('#game-board').addClass('hide');
  $('#game-picker').addClass('hide');
};

// Displays New or Existing Game Menu
const gamePicker = function() {
  $('#login-screen').addClass('hide');
  $('#game-board').addClass('hide');
  $('#game-picker').removeClass('hide');
};

// Displays Game Play Menu
const gameBoard = function() {
  $('#login-screen').addClass('hide');
  $('#game-board').addClass('hide');
  $('#game-picker').removeClass('hide');
};

module.exports = {
  loginScreen,
  gamePicker,
  gameBoard,
};
