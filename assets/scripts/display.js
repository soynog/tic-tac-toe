'use strict';

// Array holds selectors for the various sections of the app.
const sections = [
  '.game-board',
  '.announce',
  '.sign-up',
  '.sign-in',
  '.create-game',
  '.sign-in-o',
  '.add-player-o',
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

module.exports = {
  hideAll,
  showSections,
};
