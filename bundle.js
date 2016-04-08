webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// user require with a reference to bundle the file and use it in this file
	// var example = require('./example');

	// load manifests
	// scripts

	__webpack_require__(1);

	// styles
	__webpack_require__(13);

	// attach jQuery globally
	__webpack_require__(17);
	__webpack_require__(18);

	// attach getFormFields globally

	__webpack_require__(19);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var events = __webpack_require__(3);
	var flow = __webpack_require__(8);

	// On document ready
	$(function () {
	  // Show the start screen
	  flow.startScreen();

	  // Create Sign In Handlers
	  events.signInHandlers();

	  // Create Game Handlers
	  events.gameHandlers();
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var getFormFields = __webpack_require__(4);

	var api = __webpack_require__(5);
	var ui = __webpack_require__(7);
	var app = __webpack_require__(6);
	var ttt = __webpack_require__(10);
	var flow = __webpack_require__(8);

	var signInHandlers = function signInHandlers() {
	  // Create a new user
	  $('.sign-up').on('submit', function (event) {
	    var data = getFormFields(this);
	    event.preventDefault();
	    api.signUp(ui.success, ui.failure, data);
	  });

	  // Sign in an existing user
	  $('.sign-in').on('submit', function (event) {
	    event.preventDefault();
	    var data = getFormFields(this);
	    if (!app.game) {
	      // If no game exists yet, sign in user as primary user and go to picker screen.
	      api.signIn(ui.signInSuccess_user1, ui.signInFail, data);
	    } else {
	      // If a game already exists, determine if a second player is still needed.
	      if (!app.game.player_o) {
	        // If the game only has one player, sign the user in as player O and add them to the game.
	        api.signIn(ui.signInSuccess_user2_add, ui.signInFail, data);
	      } else {
	        // If the game already has a player O, check to make sure the user signing in matches the correct user, and sign them in (without Adding to the game since they're already added).
	        if (data.credentials.email === app.game.player_o.email || data.credentials.email === app.game.player_x.email) {
	          api.signIn(ui.signInSuccess_user2, ui.signInFail, data);
	        }
	      }
	    }
	  });

	  // Sign out of current user
	  $('.sign-out').on('submit', function (event) {
	    event.preventDefault();
	    api.signOut(ui.signOutSuccess, ui.failure);
	  });

	  // Start a new game
	  $('.create-hotseat').on('submit', function (event) {
	    event.preventDefault();
	    if (!app.game) {
	      api.createGame(ui.createHotseatSuccess, ui.failure);
	    } else {
	      console.log("Game already created!");
	    }
	  });

	  $('.create-remote').on('submit', function (event) {
	    event.preventDefault();
	    console.log("Creating Remote...");
	    if (!app.game) {
	      api.createGame(ui.createRemoteSuccess, ui.failure);
	    } else {
	      console.log("Game already created!");
	    }
	  });

	  // Join a game by ID
	  $('.join-game').on('submit', function (event) {
	    event.preventDefault();
	    console.log("Joining game...");
	    var id = getFormFields(this).id;
	    // Try joining the game. If it succeeds, add player O. If it fails, get the info and join it like a previous game.
	    api.joinGame(ui.addPlayerOSuccess, ui.failure, id);
	    api.getGame(ui.joinRemoteSuccess, ui.failure, id);
	  });

	  // Open an incomplete gameHandlers
	  $('.prev-games').click(function (event) {
	    event.preventDefault();
	    if ($(event.target).is("button")) {
	      var gameId = $(event.target).text();
	      // Login player O
	      api.getGame(ui.openGameSuccess, ui.failure, gameId);
	    }
	  });

	  // Change User Password
	  $('.change-pw').on('submit', function (event) {
	    var data = getFormFields(this);
	    event.preventDefault();
	    api.changePW(ui.changePWSuccess, ui.failure, data);
	  });

	  // Back to game picker
	  $('.back-to-picker').on('submit', function (event) {
	    event.preventDefault();
	    flow.pickerScreen();
	  });
	};

	var gameHandlers = function gameHandlers() {
	  // Clicking on a game square triggers game logic for placing on that square.
	  $('.game-board').click(function (event) {
	    if ($(event.target).is("button")) {
	      event.preventDefault();
	      var index = $(event.target).attr('id');
	      var playTurn = ttt.turn(app.game);
	      // Before Updating: Check if game is live, the current player is signed in on this computer, and the move is valid.
	      if (!app.game.over && app.myTurn(playTurn) && ttt.validMove(app.game, index)) {
	        api.updateGame(ui.playSuccess, ui.failure, index, playTurn, false);
	      }
	    }
	  });
	};

	module.exports = {
	  signInHandlers: signInHandlers,
	  gameHandlers: gameHandlers
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	var addFormField = function addFormField(target, names, value) {
	  var name = names.shift();
	  var next = names[0];
	  if (next === '') {
	    // name is an array
	    target[name] = target[name] || [];
	    target[name].push(value);
	  } else if (next) {
	    // name is a parent key
	    target[name] = target[name] || {};
	    addFormField(target[name], names, value);
	  } else {
	    // name is the key for value
	    target[name] = value;
	  }

	  return target;
	};

	var getFormFields = function getFormFields(form) {
	  var target = {};

	  var elements = form.elements || [];
	  for (var i = 0; i < elements.length; i++) {
	    var e = elements[i];
	    if (!e.hasAttribute('name')) {
	      continue;
	    }

	    var type = 'TEXT';
	    switch (e.nodeName.toUpperCase()) {
	      case 'SELECT':
	        type = e.hasAttribute('multiple') ? 'MULTIPLE' : type;
	        break;
	      case 'INPUT':
	        type = e.getAttribute('type').toUpperCase();
	        break;
	    }

	    var names = e.getAttribute('name').split('[').map(function (k) {
	      return k.replace(/]$/, '');
	    });

	    if (type === 'MULTIPLE') {
	      for (var _i = 0; _i < e.length; _i++) {
	        if (e[_i].selected) {
	          addFormField(target, names.slice(), e[_i].value);
	        }
	      }
	    } else if (type !== 'RADIO' && type !== 'CHECKBOX' || e.checked) {
	      addFormField(target, names, e.value);
	    }
	  }

	  return target;
	};

	module.exports = getFormFields;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var app = __webpack_require__(6);
	// const display = require('../display');

	// Sign up a new user.
	var signUp = function signUp(success, failure, data) {
	  console.log("Signing Up");
	  if (data) {
	    $.ajax({
	      method: 'POST',
	      url: app.api + '/sign-up',
	      data: data
	    }).done(success).fail(failure);
	  } else {
	    console.log("No data!");
	  }
	};

	// Sign in an existing user.
	var signIn = function signIn(success, failure, data) {
	  console.log("Signing In");
	  if (data) {
	    $.ajax({
	      method: 'POST',
	      url: app.api + '/sign-in',
	      data: data
	    }).done(success).fail(failure);
	  } else {
	    console.log("No data!");
	  }
	};

	// Get list of games played by user.
	var getGames = function getGames(success, failure, over) {
	  var url = app.api + '/games' + (over !== undefined ? '/?over=' + String(over) : '');
	  $.ajax({
	    method: 'GET',
	    url: url,
	    headers: {
	      Authorization: 'Token token=' + app.localUsers[0].token
	    }
	  }).done(success).fail(failure);
	};

	// Get a game based on its ID.
	var getGame = function getGame(success, failure, id) {
	  $.ajax({
	    method: 'GET',
	    url: app.api + '/games/' + id,
	    headers: {
	      Authorization: 'Token token=' + app.localUsers[0].token
	    }
	  }).done(success).fail(failure);
	};

	// Sign out of current user.
	var signOut = function signOut(success, failure) {
	  console.log("Signing Out");
	  if (app.localUsers.length > 0) {
	    $.ajax({
	      method: 'DELETE',
	      url: app.api + '/sign-out/' + app.localUsers[0].id,
	      headers: {
	        Authorization: 'Token token=' + app.localUsers[0].token
	      }
	    }).done(success).fail(failure);
	  } else {
	    console.log("No user to sign out...");
	  }
	};

	// Create a new game.
	var createGame = function createGame(success, failure) {
	  console.log("Creating a new game");
	  $.ajax({
	    method: 'POST',
	    url: app.api + '/games',
	    headers: {
	      Authorization: 'Token token=' + app.localUsers[0].token
	    }
	  }).done(success).fail(failure);
	};

	// Add player O to the new game.
	var addPlayerO = function addPlayerO(success, failure, id, token) {
	  $.ajax({
	    method: 'PATCH',
	    url: app.api + '/games/' + (id || app.game.id),
	    headers: {
	      Authorization: 'Token token=' + (token || app.localUsers[1].token)
	    }
	  }).done(success).fail(failure);
	};

	// Updates the gamestate based on a recent play.
	var updateGame = function updateGame(success, failure, index, player, gameOver) {
	  console.log("Updating game");

	  var data = {
	    game: {
	      cell: {}
	    }
	  };

	  if (index && player) {
	    data.game.cell.index = index;
	    data.game.cell.value = player;
	  }

	  if (gameOver) {
	    data.game.over = gameOver;
	  }

	  $.ajax({
	    method: 'PATCH',
	    url: app.api + '/games/' + app.game.id,
	    headers: {
	      Authorization: 'Token token=' + app.localUsers[0].token
	    },
	    data: data
	  }).done(success).fail(failure);
	};

	var changePW = function changePW(success, failure, formData) {
	  console.log("Changing password");
	  var data = {
	    passwords: {}
	  };
	  if (formData.passwords) {
	    data.passwords.new = formData.passwords.new;
	    data.passwords.old = formData.passwords.old;
	  }
	  $.ajax({
	    method: 'PATCH',
	    url: app.api + '/change-password/' + app.localUsers[0].id,
	    headers: {
	      Authorization: 'Token token=' + app.localUsers[0].token
	    },
	    data: data
	  }).done(success).fail(failure);
	};

	var joinGame = function joinGame(success, failure, id) {
	  var token = app.localUsers[0].token;
	  console.log("In JoinGame function. Calling addPlayerO with " + id + " and " + token + ".");
	  addPlayerO(success, failure, id, token);
	};

	module.exports = {
	  signUp: signUp,
	  signIn: signIn,
	  signOut: signOut,
	  createGame: createGame,
	  addPlayerO: addPlayerO,
	  updateGame: updateGame,
	  changePW: changePW,
	  getGames: getGames,
	  getGame: getGame,
	  joinGame: joinGame
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var app = {
	  api: 'http://tic-tac-toe.wdibos.com',
	  localUsers: [], // Push users to this as they sign in.
	  game: null,
	  clearGame: function clearGame() {
	    app.game = null;
	    if (app.localUsers.length > 1) {
	      delete app.localUsers[1];
	    }
	  },
	  signOut: function signOut() {
	    app.clearGame();
	    app.localUsers = [];
	  },
	  getPlayerEmail: function getPlayerEmail(letter) {
	    if (letter === 'x' && app.game && app.game.player_x) {
	      return app.game.player_x.email;
	    } else if (letter === 'o' && app.game && app.game.player_o) {
	      return app.game.player_o.email;
	    }
	  },
	  myTurn: function myTurn(playTurn) {
	    for (var i in app.localUsers) {
	      if (app.localUsers[i].email === app.getPlayerEmail(playTurn)) {
	        return true;
	      }
	    }
	    return false;
	  },
	  isRemote: function isRemote() {
	    return app.localUsers.length === 1;
	  }
	};

	module.exports = app;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var app = __webpack_require__(6);
	var api = __webpack_require__(5);
	var flow = __webpack_require__(8);
	var createWatcher = __webpack_require__(11);

	// Generic AJAX request success function.
	var success = function success(data) {
	  console.log(data);
	  console.log(app);
	};

	// Generic AJAX request failure function.
	var failure = function failure(error) {
	  console.error(error);
	};

	// If adding a player is successful, update app-data and go to Game Screen
	var addPlayerOSuccess = function addPlayerOSuccess(data) {
	  if (data.game) {
	    app.game = data.game;
	  }
	  flow.gameScreen();
	  console.log("Adding Player O");
	  console.log(app);
	  if (app.isRemote()) {
	    createWatcher();
	  }
	};

	// If game already has 2 players, join it like a previous game. Otherwise, add player O and join it.
	var joinRemoteSuccess = function joinRemoteSuccess(data) {
	  console.log("Join Remote Successful");
	  if (data.game.player_o) {
	    // If game already has a player O...
	    console.log("Joining existing game");
	    app.game = data.game;
	    console.log(app);
	    flow.gameScreen();
	    console.log(app.isRemote);
	    if (app.isRemote()) {
	      createWatcher();
	    }
	  } else {
	    // If there isn't a player O, add current player.
	    var id = data.game.id;
	    var token = app.localUsers[0].token;
	    console.log("Joining new remote game. Calling addPlayerO with " + id + " and " + token + ".");
	    api.addPlayerO(addPlayerOSuccess, failure, id, token);
	  }
	};

	// If game successfully opens, update game data to match retreived game and open Player 2 Signin Screen
	var openGameSuccess = function openGameSuccess(data) {
	  app.game = data.game;
	  console.log("Opening Game");
	  console.log(app);
	  flow.signInUser2();
	};

	// If User 1 Sign-In is successful, update app-data and go to Picker Screen.
	var signInSuccess_user1 = function signInSuccess_user1(data) {
	  app.localUsers.push(data.user);
	  console.log("Pushing User 1");
	  console.log(app);
	  flow.pickerScreen();
	};

	// If User 2 Sign-In is successful, update app-data and add Player O.
	var signInSuccess_user2_add = function signInSuccess_user2_add(data) {
	  app.localUsers.push(data.user);
	  console.log("Pushing User 2");
	  console.log(app);
	  api.addPlayerO(addPlayerOSuccess, failure);
	};

	// If User 2 Sign-In is successful, update app-data only.
	var signInSuccess_user2 = function signInSuccess_user2(data) {
	  app.localUsers.push(data.user);
	  console.log("Pushing User 2");
	  console.log(app);
	  flow.gameScreen();
	};

	// If Sign-In Fails, tell user to enter a valid username and password.
	var signInFail = function signInFail() {
	  flow.pickerScreen("Please enter a valid username and password.");
	};

	// If game creation is successful, update app data and show signInUser2 Screen.
	var createHotseatSuccess = function createHotseatSuccess(data) {
	  app.game = data.game;
	  console.log("Creating hotseat game");
	  console.log(app);
	  flow.signInUser2();
	};

	// If game creation is successful, go directly to game screen.
	var createRemoteSuccess = function createRemoteSuccess(data) {
	  app.game = data.game;
	  console.log("Creating Remote Game");
	  console.log(app);
	  flow.gameScreen("Waiting for a remote player to sign in...");
	  createWatcher();
	};

	// If signout is successful, clear app data and go to Start Screen.
	var signOutSuccess = function signOutSuccess() {
	  console.log("Signing out");
	  flow.startScreen();
	};

	// If a play request is successful, update app data and refresh the game board. Also, check if the play caused a win or a draw and if so update the game again.
	var playSuccess = function playSuccess(data) {
	  app.game.cells = data.game.cells;
	  console.log("Making a play");
	  flow.gameRefresh();
	};

	// If a password change request is successful, return to game picker screen.
	var changePWSuccess = function changePWSuccess() {
	  console.log("Changing password");
	  flow.pickerScreen("Change Password Success!");
	};

	module.exports = {
	  failure: failure,
	  success: success,
	  signOutSuccess: signOutSuccess,
	  signInSuccess_user1: signInSuccess_user1,
	  signInSuccess_user2: signInSuccess_user2,
	  signInSuccess_user2_add: signInSuccess_user2_add,
	  signInFail: signInFail,
	  createHotseatSuccess: createHotseatSuccess,
	  createRemoteSuccess: createRemoteSuccess,
	  addPlayerOSuccess: addPlayerOSuccess,
	  playSuccess: playSuccess,
	  changePWSuccess: changePWSuccess,
	  openGameSuccess: openGameSuccess,
	  joinRemoteSuccess: joinRemoteSuccess
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Display functions for showing various screens:
	var disp = __webpack_require__(9);
	var api = __webpack_require__(5);
	var app = __webpack_require__(6);
	var ttt = __webpack_require__(10);

	// Start Screen Display
	var startScreen = function startScreen() {
	  disp.hideAll();
	  disp.clearAll();
	  app.signOut();
	  disp.showSections('.sign-in.user1', '.sign-up', '.announce');
	  console.log("Start Screen");
	  console.log(app);
	};

	// Game Picker Screen Display
	var pickerScreen = function pickerScreen(msg) {
	  disp.hideAll();
	  disp.clearAll();
	  app.clearGame();
	  disp.showSections('.create-hotseat', '.create-remote', '.join-game', '.prev-games', '.change-pw', '.sign-out');
	  api.getGames(function (data) {
	    return disp.showGameCount(data.games.length);
	  }, function (error) {
	    return console.log(error);
	  });
	  api.getGames(function (data) {
	    return disp.addPrevGames(data.games);
	  }, function (error) {
	    return console.log(error);
	  }, false);
	  if (msg) {
	    disp.announce(msg);
	  }
	  console.log("Picker Screen");
	  console.log(app);
	};

	// Sign in Player 2 Display
	var signInUser2 = function signInUser2(msg) {
	  disp.hideAll();
	  disp.showSections('.sign-in.user2', '.announce', '.back-to-picker');
	  if (app.game.player_o) {
	    var missingPlayer = app.game.player_o.email === app.localUsers[0].email ? app.game.player_x.email : app.game.player_o.email;
	    disp.announce("Please sign in " + missingPlayer + ".");
	  }
	  if (msg) {
	    disp.announce(msg);
	  }
	  console.log("Sign In User 2 Screen");
	  console.log(app);
	};

	// Refresh game board and announcements
	var gameRefresh = function gameRefresh(msg) {
	  disp.updateGameTitle(app.game.id);
	  disp.updateBoard(app.game.cells);
	  var player = ttt.turn(app.game);
	  var email = app.getPlayerEmail(player);

	  // If game is not over, check for a winner or end state, and if so update the game and refresh again. If not, display whose turn it is.
	  if (!app.game.over) {
	    if (ttt.checkWin(app.game) || ttt.checkFull(app.game)) {
	      api.updateGame(function (data) {
	        app.game.over = data.game.over;
	        gameRefresh();
	      }, function (err) {
	        return console.log(err);
	      }, null, null, true);
	    } else {
	      disp.announce("Player " + player + "'s turn. Go ahead " + email + "!");
	    }
	  } else {
	    // If game is over, display the appropriate ending message
	    if (ttt.checkWin(app.game)) {
	      var winner = ttt.checkWin(app.game);
	      var winnerEmail = app.getPlayerEmail(winner);
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
	var gameScreen = function gameScreen(msg) {
	  disp.hideAll();
	  gameRefresh();
	  disp.showSections('.game-board', '.announce', '.back-to-picker', '.sign-out');
	  if (msg) {
	    disp.announce(msg);
	  }

	  console.log("Game Screen");
	  console.log(app);
	};

	module.exports = {
	  startScreen: startScreen,
	  pickerScreen: pickerScreen,
	  signInUser2: signInUser2,
	  gameScreen: gameScreen,
	  gameRefresh: gameRefresh
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	// Array holds selectors for the various sections of the app.

	var sections = ['.sign-up', '.sign-in.user1', '.announce', '.create-hotseat', '.create-remote', '.join-game', '.prev-games', '.change-pw', '.sign-out', '.sign-in.user2', '.back-to-picker', '.game-board'];

	// Hide all sections.
	var hideAll = function hideAll() {
	  for (var i in sections) {
	    $(sections[i]).addClass('hide');
	  }
	};

	// Displays Sign In and Sign Up Screen
	var showSections = function showSections() {
	  for (var i in arguments) {
	    $(arguments[i]).removeClass('hide');
	  }
	};

	// Displays text in the announce field below the board.
	var announce = function announce(msg) {
	  $('.announce').text(msg);
	};

	// Updates the board based on the current game state.
	var updateBoard = function updateBoard(cells) {
	  console.log("Updating Board");
	  for (var i in cells) {
	    $('button#' + i).text(cells[i].toUpperCase());
	  }
	};

	// Update the game board title.
	var updateGameTitle = function updateGameTitle(id) {
	  console.log("Updating Title");
	  $('.game-title').text("Game #" + id);
	};

	// Clears the board.
	var clearBoard = function clearBoard() {
	  console.log("Clearing Board");
	  $('.buttons button').text("");
	};

	// Shows # games played in Previous Games section
	var showGameCount = function showGameCount(n) {
	  $('.game-count').text(n ? "Games Played: " + n : "");
	};

	// Clears the list of previous games
	var clearPrevGames = function clearPrevGames() {
	  console.log("Clearing previous games");
	  $(".game-button").remove();
	};

	// Clears the board and all text fields, and resets game and user2 data. If passed true as a parameter, also clears User1 data.
	var clearAll = function clearAll() {
	  clearBoard();
	  announce('');
	  showGameCount('');
	  clearPrevGames();
	};

	// Adds buttons for each of the unfinished games.
	var addPrevGames = function addPrevGames(games) {
	  $('#game-list-header').text("Incomplete Games (click to play hotseat): ");
	  for (var i in games) {
	    var game = document.createElement("button");
	    var dispText = document.createTextNode(games[i].id);
	    var insertAt = document.getElementById('insert-here');
	    var parentDiv = document.getElementById('game-list');
	    game.appendChild(dispText);
	    parentDiv.insertBefore(game, insertAt);
	  }
	  $('.game-list button').addClass('game-button');
	};

	module.exports = {
	  hideAll: hideAll,
	  showSections: showSections,
	  announce: announce,
	  updateBoard: updateBoard,
	  clearBoard: clearBoard,
	  showGameCount: showGameCount,
	  clearAll: clearAll,
	  addPrevGames: addPrevGames,
	  clearPrevGames: clearPrevGames,
	  updateGameTitle: updateGameTitle
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var validMove = function validMove(game, index) {
	  if (!game.cells[index]) {
	    // game.cells[index] = player;
	    // $('button#' + index).text(player);
	    return true;
	  }
	  return false;
	};

	// Check-Win function that takes a board of cells and checks for a win.
	var checkWin = function checkWin(game) {
	  console.log("Checking Win");
	  var triplets = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
	  var cells = game.cells;
	  for (var i in triplets) {
	    var t = triplets[i];
	    if (cells[t[0]] && cells[t[0]] === cells[t[1]] && cells[t[1]] === cells[t[2]]) {
	      console.log("We have a winner!");
	      return cells[t[0]];
	    }
	  }
	  return false;
	};

	// Returns true if all of the board is full.
	var checkFull = function checkFull(game) {
	  return game.cells.every(function (i) {
	    return i;
	  });
	};

	// Determine player based on # of cells of each type
	var turn = function turn(game) {
	  var xs = 0;
	  var os = 0;
	  for (var i in game.cells) {
	    if (game.cells[i] === 'x') {
	      xs++;
	    } else if (game.cells[i] === 'o') {
	      os++;
	    }
	  }
	  return xs > os ? 'o' : 'x';
	};

	// Play turn using a game object passed.
	var playTurn = function playTurn(game, index) {
	  if (!game.over) {
	    var player = turn(game);
	    if (validMove(game, index, player)) {
	      if (checkWin(game)) {
	        $('.announce').text('Game Over! Player ' + player + ' wins!!!');
	        //game.over = true;
	      } else if (checkFull(game)) {
	          $('.announce').text("Game Over! It's a tie.");
	          //game.over = true;
	        } else {
	            //this.turn = this.turn === 'X' ? 'O' : 'X';
	            $('.announce').text("Player " + player + "'s turn.");
	            // Next turn
	          }
	    } else {
	        $('.announce').text("Invalid Move! Try again, player " + player + ".");
	      }
	  }
	};

	module.exports = {
	  checkWin: checkWin,
	  checkFull: checkFull,
	  playTurn: playTurn,
	  validMove: validMove,
	  turn: turn
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var remote = __webpack_require__(12);
	var app = __webpack_require__(6);
	var api = __webpack_require__(5);
	var flow = __webpack_require__(8);

	// Updates app data with game data and refreshes view.
	var watchGameSuccess = function watchGameSuccess(data) {
	  console.log("Watching Game");
	  console.log(data);
	  app.game = data.game;
	  console.log(app);
	  flow.gameRefresh();
	};

	// Create Game Watcher
	var createWatcher = function createWatcher() {
	  var gameWatcher = remote.resourceWatcher(app.api + '/games/' + app.game.id + '/watch', { Authorization: 'Token token=' + app.localUsers[0].token });
	  gameWatcher.on('change', function (data) {
	    console.log("WATCHER SEES CHANGE");
	    if (data.timeout) {
	      //not an error
	      gameWatcher.close();
	      return console.warn(data.timeout);
	      api.signOut(function (data) {
	        return console.log(data);
	      }, function (err) {
	        return console.log(err);
	      });
	    } else if (data.game) {
	      console.log("Received Game Data");
	      console.log(data);
	      api.getGame(watchGameSuccess, function (e) {
	        return console.log(e);
	      }, app.game.id);
	    } else {
	      console.log("thumpTHUMP");
	    }
	  });

	  gameWatcher.on('error', function (e) {
	    console.log("WATCHER SEES ERROR");
	    console.error('an error has occured with the stream', e);
	  });
	};

	module.exports = createWatcher;

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	var resourceWatcher = function resourceWatcher(url, conf) {
	  var token = function token(conf) {
	    return conf && (conf = conf.Authorization) && (conf = typeof conf === 'string' && conf.split('=')) && Array.isArray(conf) && conf[1];
	  };
	  url += '?token=' + token(conf);
	  url += conf.timeout ? '&timeout=' + conf.timeout : '';
	  var es = new EventSource(url); //jshint ignore: line
	  var close = function close() {
	    es.close();
	  };
	  var makeHandler = function makeHandler(handler, close) {
	    return function (e) {
	      if (close) {
	        close();
	      }
	      return handler(e.data ? JSON.parse(e.data) : e);
	    };
	  };

	  var on = function on(event, handler) {
	    switch (event) {
	      case 'connect':
	        es.onopen = makeHandler(handler);
	        break;
	      case 'change':
	        es.onmessage = makeHandler(handler);
	        break;
	      case 'error':
	        es.onerror = makeHandler(handler, close);
	        break;
	      default:
	        console.error('Unknown event type:' + event);
	        break;
	    }
	  };

	  return {
	    close: close,
	    on: on
	  };
	};

	module.exports = {
	  resourceWatcher: resourceWatcher
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(14);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(16)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./index.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./index.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(15)();
	// imports


	// module
	exports.push([module.id, "header {\n  text-align: center; }\n\nbody {\n  background-color: #fcfcfa; }\n\nform {\n  clear: both;\n  margin: 20px auto; }\n\nbutton,\ninput {\n  background-color: #eee;\n  border: 1px #ddd solid;\n  margin: 5px;\n  padding: 5px 20px; }\n\ninput[type=text],\ninput[type=password] {\n  background-color: #fcfcfa; }\n\n.cont {\n  clear: both;\n  margin: 0 auto;\n  width: 240px; }\n\n.announce {\n  clear: both;\n  text-align: center;\n  width: 240px; }\n\n.hide {\n  display: none; }\n\n.game-board {\n  margin: 0 0 260px; }\n  .game-board .ttt-row {\n    margin: 0 auto;\n    width: 210px; }\n    .game-board .ttt-row button {\n      background-color: #eee;\n      border: 1px #ddd solid;\n      float: left;\n      height: 60px;\n      line-height: 60px;\n      margin: 5px;\n      padding: 0;\n      text-align: center;\n      width: 60px; }\n\n.prev-games .game-list {\n  clear: both;\n  text-align: center; }\n\nh1 {\n  color: #333;\n  font-family: monospace;\n  font-size: 24pt; }\n\nh2 {\n  color: #333;\n  font-family: sans-serif;\n  font-size: 18pt;\n  text-align: center; }\n\np {\n  color: #333;\n  font-family: monospace;\n  font-size: 12pt; }\n\nlegend {\n  font-family: sans-serif; }\n\n.announce {\n  font-family: sans-serif;\n  font-size: 18pt; }\n\n.game-board button {\n  font-family: \"Century Gothic\", sans-serif;\n  font-size: 40pt;\n  font-weight: bold;\n  text-align: center; }\n\n.prev-games p {\n  font-family: sans-serif; }\n", ""]);

	// exports


/***/ },
/* 15 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["$"] = __webpack_require__(2);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["jQuery"] = __webpack_require__(2);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["getFormFields"] = __webpack_require__(4);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
]);