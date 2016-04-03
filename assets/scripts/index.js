'use strict';

const Game = require('./tictactoe');
const authEvents = require('./auth/events');

// On document ready
$(() => {
  // Create new game.
  authEvents.signInHandlers();
  //
  // let theGame = new Game("Calvin","Hobbes");
  // console.log(theGame);
  //
  // // Sign In Event Handler
  //
  // // Add click event handlers
  // $('#hide').click(function() {
  //   $('#game-board').toggleClass("hide");
  //   $('#login-screen').toggleClass("hide");
  // });
  // $('#buttons').click(function(event) {
  //   if($(event.target).is("button")) {
  //     theGame.playTurn($(event.target).attr('id'));
  //   }
});
