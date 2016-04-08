'use strict';

const remote = require('../../lib/resource-watcher');
const app = require('./app-data');
const api = require('./api');
const flow = require('./flow-control');

// Create Game Watcher
const createWatcher = function() {
  let gameWatcher = remote.resourceWatcher(
    (app.api + '/games/' + app.game.id + '/watch'),
    {Authorization: 'Token token=' + app.localUsers[0].token}
  );
  gameWatcher.on('change', function (data) {
    console.log("WATCHER SEES CHANGE");
    if (data.timeout) { //not an error
      gameWatcher.close();
      return console.warn(data.timeout);
    } else if (data.game) {
        console.log("Received Game Data");
        console.log(data);
        api.getGame(watchGameSuccess,e => console.log(e),app.game.id);
    } else {
      console.log(data);
      console.log("thumpTHUMP");
    }
  });

  gameWatcher.on('error', function (e) {
    console.log("WATCHER SEES ERROR");
    console.error('an error has occured with the stream', e);
  });
};

// Updates app data with game data and refreshes view.
const watchGameSuccess = (data) => {
  console.log("Watching Game");
  console.log(data);
  app.game = data.game;
  console.log(app);
  flow.gameRefresh();
};

module.exports = createWatcher;
