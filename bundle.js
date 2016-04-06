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
	__webpack_require__(10);

	// attach jQuery globally
	__webpack_require__(14);
	__webpack_require__(15);

	// attach getFormFields globally

	__webpack_require__(16);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var events = __webpack_require__(3);

	// On document ready
	$(function () {
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

	var authApi = __webpack_require__(5);
	var authUi = __webpack_require__(8);
	var app = __webpack_require__(6);
	var ttt = __webpack_require__(9);

	var signInHandlers = function signInHandlers() {
	  // Create a new user
	  $('form.sign-up').on('submit', function (event) {
	    var data = getFormFields(this);
	    event.preventDefault();
	    console.log(data);
	    authApi.signUp(authUi.success, authUi.failure, data);
	  });

	  // Sign in an existing user
	  $('.sign-in').on('submit', function (event) {
	    var data = getFormFields(this);
	    event.preventDefault();
	    authApi.signIn(authUi.signInSuccess, authUi.signInFail, data);
	  });

	  // Sign out of current user
	  $('.sign-out').on('submit', function (event) {
	    event.preventDefault();
	    authApi.signOut(authUi.signOutSuccess, authUi.failure);
	  });

	  // Start a new game
	  $('.create-game').on('submit', function (event) {
	    event.preventDefault();
	    authApi.createGame(authUi.createGameSuccess, authUi.failure);
	  });

	  // Change User Password
	  $('.change-pw').on('submit', function (event) {
	    var data = getFormFields(this);
	    event.preventDefault();
	    authApi.changePW(authUi.changePWSuccess, authUi.failure, data);
	  });
	};

	var gameHandlers = function gameHandlers() {
	  // Clicking on a game square triggers game logic for placing on that square.
	  $('.game-board').click(function (event) {
	    if ($(event.target).is("button")) {
	      event.preventDefault();
	      var index = $(event.target).attr('id');
	      if (!app.game.over && ttt.validMove(app.game, index)) {
	        authApi.updateGame(authUi.playSuccess, authUi.failure, index, ttt.turn(app.game), false);
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
	var display = __webpack_require__(7);

	// Sign up a new user.
	var signUp = function signUp(success, failure, data) {
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
	    if (app.user && data.credentials.email === app.user.email) {
	      display.announce(app.user.email + " is already signed in!");
	    } else {
	      $.ajax({
	        method: 'POST',
	        url: app.api + '/sign-in',
	        data: data
	      }).done(success).fail(failure);
	    }
	  } else {
	    console.log("No data!");
	  }
	};

	// Sign out of current user.
	var signOut = function signOut(success, failure) {
	  if (app.user) {
	    $.ajax({
	      method: 'DELETE',
	      url: app.api + '/sign-out/' + app.user.id,
	      headers: {
	        Authorization: 'Token token=' + app.user.token
	      }
	    }).done(success).fail(failure);
	  } else {
	    console.log("No user to sign out...");
	  }
	};

	// Create a new game.
	var createGame = function createGame(success, failure) {
	  if (!app.game) {
	    $.ajax({
	      method: 'POST',
	      url: app.api + '/games',
	      headers: {
	        Authorization: 'Token token=' + app.user.token
	      }
	    }).done(success).fail(failure);
	  } else {
	    console.log("Game already created!");
	  }
	};

	// Add player O to the new game.
	var addPlayerO = function addPlayerO(success, failure) {
	  if (app.game && app.user2) {
	    $.ajax({
	      method: 'PATCH',
	      url: app.api + '/games/' + app.game.id,
	      headers: {
	        Authorization: 'Token token=' + app.user2.token
	      }
	    }).done(success).fail(failure);
	  } else {
	    console.log("Need a game and a second user to add!");
	  }
	};

	// Updates the gamestate based on a recent play.
	var updateGame = function updateGame(success, failure, index, player, gameOver) {
	  console.log("updateGame");

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

	  console.log(data);

	  $.ajax({
	    method: 'PATCH',
	    url: app.api + '/games/' + app.game.id,
	    headers: {
	      Authorization: 'Token token=' + app.user.token
	    },
	    data: data
	  }).done(success).fail(failure);
	};

	var changePW = function changePW(success, failure, formData) {
	  var data = {
	    passwords: {}
	  };
	  if (formData.passwords) {
	    data.passwords.new = formData.passwords.new;
	    data.passwords.old = formData.passwords.old;
	  }
	  console.log(data);
	  $.ajax({
	    method: 'PATCH',
	    url: app.api + '/change-password/' + app.user.id,
	    headers: {
	      Authorization: 'Token token=' + app.user.token
	    },
	    data: data
	  }).done(success).fail(failure);
	};

	module.exports = {
	  signUp: signUp,
	  signIn: signIn,
	  signOut: signOut,
	  createGame: createGame,
	  addPlayerO: addPlayerO,
	  updateGame: updateGame,
	  changePW: changePW
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var app = {
	  api: 'http://tic-tac-toe.wdibos.com'
	};

	module.exports = app;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	// Array holds selectors for the various sections of the app.

	var sections = ['.game-board', '.announce', '.sign-up', '.sign-in.player-x', '.sign-in.player-o', '.create-game', '.sign-out', '.change-pw'];

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
	  console.log("Update Board");
	  for (var i in cells) {
	    $('button#' + i).text(cells[i].toUpperCase());
	  }
	};

	// Clears the board.
	var clearBoard = function clearBoard() {
	  console.log("Clearing Board");
	  $('.buttons button').text("");
	};

	module.exports = {
	  hideAll: hideAll,
	  showSections: showSections,
	  announce: announce,
	  updateBoard: updateBoard,
	  clearBoard: clearBoard
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ttt = __webpack_require__(9);
	var app = __webpack_require__(6);
	var display = __webpack_require__(7);
	var authApi = __webpack_require__(5);

	// Generic AJAX request success function.
	var success = function success(data) {
	  console.log(data);
	  console.log(app);
	};

	// Generic AJAX request failure function.
	var failure = function failure(error) {
	  console.error(error);
	};

	// If adding a player is successful, redraws display and updates app data.
	var addPlayerOSuccess = function addPlayerOSuccess(data) {
	  if (data.game) {
	    app.game = data.game;
	  }
	  display.hideAll();
	  display.showSections('.game-board', '.announce', '.sign-out');
	  display.announce("Player " + ttt.turn(app.game) + "'s turn.");
	  console.log(data);
	  console.log(app);
	};

	// If Sign-In is successful, redraws display as appropriate.
	var signInSuccess = function signInSuccess(data) {
	  if (app.user) {
	    // If one player is already signed in, add second player to current game.
	    app.user2 = data.user;
	    authApi.addPlayerO(addPlayerOSuccess, failure);
	  } else {
	    app.user = data.user;
	    display.hideAll();
	    display.announce('');
	    display.showSections('.create-game', '.sign-out', '.change-pw');
	  }
	  console.log(app);
	};

	// If Sign-In Fails, tell user to enter a valid username and password.
	var signInFail = function signInFail() {
	  display.announce("Please enter a valid username and password.");
	};

	// If game creation is successful, redraws display and updates app data with game info.
	var createGameSuccess = function createGameSuccess(data) {
	  console.log(data);
	  app.game = data.game;
	  console.log(app);
	  display.hideAll();
	  display.showSections('.sign-in.player-o', '.sign-out', '.announce');
	};

	// If signout is successful, redraws display and clears app data.
	var signOutSuccess = function signOutSuccess() {
	  app.user = null;
	  app.user2 = null;
	  app.game = null;
	  console.log("User signed out successfully.");
	  console.log(app);
	  display.hideAll();
	  display.showSections('.sign-in.player-x', '.sign-up');
	  display.announce('');
	  display.clearBoard();
	};

	// If game is updated successful to end it, check endgame type and update app data and display as appropriate.
	var endGameSuccess = function endGameSuccess(data) {
	  app.game.over = data.game.over;
	  if (ttt.checkWin(app.game)) {
	    var winner = ttt.checkWin(app.game);
	    display.announce('Congratulations, Player ' + winner + '! You Win!');
	  } else if (ttt.checkFull(app.game)) {
	    display.announce('A tie. Womp.');
	  }
	};

	// If a play request is successful, update app data and redraw display as appropriate. Also, check if the play caused a win or a draw and if so update the game again.
	var playSuccess = function playSuccess(data) {
	  console.log(data);
	  app.game.cells = data.game.cells;
	  console.log(app);
	  display.updateBoard(app.game.cells);
	  display.announce("Player " + ttt.turn(app.game) + "'s turn.");
	  if (ttt.checkWin(app.game) || ttt.checkFull(app.game)) {
	    authApi.updateGame(endGameSuccess, failure, null, null, true);
	  }
	};

	// If a password change request is successful, return to game picker screen.
	var changePWSuccess = function changePWSuccess() {
	  console.log("Change Password Success!");
	  display.hideAll();
	  display.showSections('.create-game', '.sign-out', '.change-pw');
	};

	module.exports = {
	  failure: failure,
	  success: success,
	  signOutSuccess: signOutSuccess,
	  signInSuccess: signInSuccess,
	  signInFail: signInFail,
	  createGameSuccess: createGameSuccess,
	  addPlayerOSuccess: addPlayerOSuccess,
	  playSuccess: playSuccess,
	  changePWSuccess: changePWSuccess
	};

/***/ },
/* 9 */
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
	  var triplets = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
	  var cells = game.cells;
	  for (var i in triplets) {
	    var t = triplets[i];
	    if (cells[t[0]] === cells[t[1]] && cells[t[1]] === cells[t[2]]) {
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(11);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(13)(content, {});
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(12)();
	// imports


	// module
	exports.push([module.id, "header {\n  text-align: center; }\n\nbody {\n  background-color: #fcfcfa; }\n\nform {\n  clear: both;\n  margin: 20px auto; }\n\ninput {\n  background-color: #eee;\n  border: 1px #ddd solid;\n  margin: 5px; }\n\n.cont {\n  clear: both;\n  margin: 0 auto;\n  width: 240px; }\n\n.announce {\n  clear: both;\n  text-align: center;\n  width: 240px; }\n\n.hide {\n  display: none; }\n\n.game-board {\n  margin: 0 0 260px; }\n  .game-board .ttt-row {\n    margin: 0 auto;\n    width: 210px; }\n    .game-board .ttt-row button {\n      background-color: #eee;\n      border: 1px #ddd solid;\n      float: left;\n      height: 60px;\n      line-height: 60px;\n      margin: 5px;\n      padding: 0;\n      text-align: center;\n      width: 60px; }\n\nh1 {\n  color: #333;\n  font-family: monospace;\n  font-size: 24pt; }\n\nlegend {\n  font-family: sans-serif; }\n\n.announce {\n  font-family: sans-serif;\n  font-size: 18pt; }\n\n.game-board button {\n  font-family: \"Century Gothic\", sans-serif;\n  font-size: 40pt;\n  font-weight: bold;\n  text-align: center; }\n", ""]);

	// exports


/***/ },
/* 12 */
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
/* 13 */
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["$"] = __webpack_require__(2);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["jQuery"] = __webpack_require__(2);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["getFormFields"] = __webpack_require__(4);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
]);