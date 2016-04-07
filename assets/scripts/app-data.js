'use strict';

const app = {
  api: 'http://tic-tac-toe.wdibos.com',
  localUsers: [], // Push users to this as they sign in.
  game: null,
  clearGame: () => {
    app.game = null;
    if (app.localUsers.length > 1) {
      app.localUsers[1] = null;
    }
  },
  signOut: () => {
    app.clearGame();
    app.localUsers = [];
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
