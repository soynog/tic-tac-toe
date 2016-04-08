'use strict';

// Display functions for showing various screens:
const disp = require('./display');
const api = require('./api');
const app = require('./app-data');
const ttt = require('./tictactoe');

// Start Screen Display
const startScreen = function() {
  disp.hideAll();
  disp.clearAll();
  app.signOut();
  disp.showSections('.sign-in.user1','.sign-up', '.announce');
  console.log("Start Screen");
  console.log(app);
};

// Game Picker Screen Display
const pickerScreen = function(msg) {
  disp.hideAll();
  disp.clearAll();
  app.clearGame();
  disp.showSections('.create-hotseat','.create-remote','.join-game','.prev-games','.change-pw','.sign-out');
  api.getGames(
    data => disp.showGameCount(data.games.length),
    error => console.log(error));
  api.getGames(
    data => disp.addPrevGames(data.games),
    error => console.log(error),
    false);
  if (msg) {
    disp.announce(msg);
  }
  console.log("Picker Screen");
  console.log(app);
};

// Sign in Player 2 Display
const signInUser2 = function(msg) {
  disp.hideAll();
  disp.showSections('.sign-in.user2','.announce','.back-to-picker');
  if (app.game.player_o) {
    let missingPlayer =
      app.game.player_o.email === app.localUsers[0].email ?
      app.game.player_x.email :
      app.game.player_o.email;
    disp.announce("Please sign in " + missingPlayer + ".");
  }
  if (msg) {
    disp.announce(msg);
  }
  console.log("Sign In User 2 Screen");
  console.log(app);
};

// Refresh game board and announcements
const gameRefresh = function(msg) {
  disp.updateGameTitle(app.game.id);
  disp.updateBoard(app.game.cells);
  let player = ttt.turn(app.game);
  let email = app.getPlayerEmail(player);

  // If game is not over, check for a winner or end state, and if so update the game and refresh again. If not, display whose turn it is.
  if (!app.game.over) {
    if(ttt.checkWin(app.game) || ttt.checkFull(app.game)) {
      api.updateGame(
          (data) => {
            app.game.over = data.game.over;
            gameRefresh();
          },
          (err) => console.log(err),
          null, null, true);
    } else {
      disp.announce("Player " + player + "'s turn. Go ahead " + email + "!");
    }
  } else {
    // If game is over, display the appropriate ending message
    if(ttt.checkWin(app.game)) {
      let winner = ttt.checkWin(app.game);
      let winnerEmail = app.getPlayerEmail(winner);
      disp.announce('Player ' + winner + ' wins! Congratulations ' + winnerEmail + '!');
    } else if (ttt.checkFull(app.game)) {
      disp.announce('A tie. Womp.');
    }
  }
  if (msg) {
    disp.announce(msg);
  }

  console.log("Refreshed.");
  console.log(app);
};

// Game Screen Display
const gameScreen = function(msg) {
  disp.hideAll();
  gameRefresh();
  disp.showSections('.game-board','.announce','.back-to-picker','.sign-out');
  if (msg) {
    disp.announce(msg);
  }

  console.log("Game Screen");
  console.log(app);
};


module.exports = {
  startScreen,
  pickerScreen,
  signInUser2,
  gameScreen,
  gameRefresh,
};
