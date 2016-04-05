'use strict';

// Array holds selectors for the various sections of the app.
const sections = [
  '.game-board',
  '.announce',
  '.sign-up',
  '.sign-in',
  '.create-game',
  '.sign-out'
];

// Hide all sections.
const hideAll = function() {
  for (let i in sections) {
    $(sections[i]).addClass('hide');
  }
};

// Displays Sign In and Sign Up Screen
const showSections = function() {
  for (let i in arguments) {
    $(arguments[i]).removeClass('hide');
  }
};

// Displays text in the announce field below the board.
const announce = function(msg) {
  $('.announce').text(msg);
};

// Updates the board based on the current game state.
const updateBoard = function(cells) {
  console.log("Update Board");
  for (let i in cells) {
    $('button#' + i).text(cells[i].toUpperCase());
  }
};

module.exports = {
  hideAll,
  showSections,
  announce,
  updateBoard,
};
