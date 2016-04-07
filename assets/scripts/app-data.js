'use strict';

const app = {
  api: 'http://tic-tac-toe.wdibos.com',
  clearGame: () => {
    app.user2 = null;
    app.game = null;
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
