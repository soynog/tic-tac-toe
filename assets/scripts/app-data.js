'use strict';

const app = {
  api: 'http://tic-tac-toe.wdibos.com',
  clear: (total) => {
    app.user2 = null;
    app.game = null;
    if (total) {
      app.user = null;
    }
  }
};


module.exports = app;
