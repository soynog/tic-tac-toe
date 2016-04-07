'use strict';

const app = {
  api: 'http://tic-tac-toe.wdibos.com',
  hotseat: null, // Set to true if it's a hotseat game, false if it's an online game.
  userLetter: null,
  clearGame: () => {
    app.user2 = null;
    app.game = null;
    app.hotseat = null;
    app.userLetter = null;
  },
  signOut: () => {
    app.user = null;
    app.clearGame();
  },
  getPlayerEmail: (letter) => {
    if (letter === 'x' && app.game && app.game.player_x) {
      return app.game.player_x.email;
    } else if (letter === 'o' && app.game && app.game.player_o) {
      return app.game.player_o.email;
    }
  }
};

module.exports = app;
