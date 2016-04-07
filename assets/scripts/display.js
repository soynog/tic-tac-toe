'use strict';

// Array holds selectors for the various sections of the app.
const sections = [
  '.sign-up',
  '.sign-in.user1',
  '.announce',
  '.create-game',
  '.prev-games',
  '.change-pw',
  '.sign-out',
  '.sign-in.user2',
  '.back-to-picker',
  '.game-board',
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

// Update the game board title.
const updateGameTitle = function(id) {
  console.log("Update Title");
  $('.game-title').text("Game #" + id);
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

// Clears the list of previous games
const clearPrevGames = function() {
  console.log("Clearing previous games");
  $(".game-button").remove();
};

// Clears the board and all text fields, and resets game and user2 data. If passed true as a parameter, also clears User1 data.
const clearAll = function() {
  clearBoard();
  announce('');
  showGameCount('');
  clearPrevGames();
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
  $('.game-list button').addClass('game-button');
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
  clearPrevGames,
  updateGameTitle,
};
