'use strict';

// Array holds selectors for the various sections of the app.
const sections = [
  '.game-board',
  '.announce',
  '.sign-up',
  '.sign-in.player-x',
  '.sign-in.player-o',
  '.create-game',
  '.sign-out',
  '.change-pw',
  '.prev-games',
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

// Clears the board.
const clearBoard = function() {
  console.log("Clearing Board");
  $('.buttons button').text("");
};

// Shows # games played in Previous Games section
const showGameCount = function(n) {
  $('.game-count').text( n ? "Games Played: " + n : "" );
};

// Clears the board and all text fields.
const clearAll = function() {
  clearBoard();
  announce('');
  showGameCount('');
};

// Adds buttons for each of the unfinished games.
const addPrevGames = function(games) {
  $('#game-list-header').text("Incomplete Games:");
  for (let i in games) {
    let game = document.createElement("button");
    let dispText = document.createTextNode(games[i].id);
    let insertAt = document.getElementById('insert-here');
    let parentDiv = document.getElementById('game-list');
    game.appendChild(dispText);
    parentDiv.insertBefore(game,insertAt);
  }
};

module.exports = {
  hideAll,
  showSections,
  announce,
  updateBoard,
  clearBoard,
  showGameCount,
  clearAll,
  addPrevGames,
};
