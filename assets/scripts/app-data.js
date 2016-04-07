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
  }
};


module.exports = app;
