'use strict';



const app = {
  api: 'http://tic-tac-toe.wdibos.com',
  localUsers: [], // Push users to this as they sign in.
  game: null,
  clearGame: () => {
    app.game = null;
    if (app.localUsers.length > 1) {
      delete app.localUsers[1];
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
  },
  myTurn: (playTurn) => {
    for (let i in app.localUsers) {
      if (app.localUsers[i].email === app.getPlayerEmail(playTurn)) {
        return true;
      }
    }
    return false;
  },
  isRemote: () => {
    return (app.localUsers.length === 1);
  }
};

module.exports = app;
