'use strict';

const Game = require('./tictactoe');

// On document ready
$(() => {
  // Create new game.
  let theGame = new Game("Calvin","Hobbes");
  console.log(theGame);

  // Add click event handlers
  $('#hide').click(function() {
    $('#game-board').toggleClass("hide");
  });
  $('#buttons').click(function(event) {
    if($(event.target).is("button")) {
      theGame.playTurn($(event.target).attr('id'));
    }
  });

  // $("#ind-0").click(function() {
  //   event.preventDefault();
  //   theGame.playTurn(0);
  // });
  // $("#ind-1").click(function() {
  //   event.preventDefault();
  //   theGame.playTurn(1);
  // });
  // $("#ind-2").click(function() {
  //   event.preventDefault();
  //   theGame.playTurn(2);
  // });
  // $("#ind-3").click(function() {
  //   event.preventDefault();
  //   theGame.playTurn(3);
  // });
  // $("#ind-4").click(function() {
  //   event.preventDefault();
  //   theGame.playTurn(4);
  // });
  // $("#ind-5").click(function() {
  //   event.preventDefault();
  //   theGame.playTurn(5);
  // });
  // $("#ind-6").click(function() {
  //   event.preventDefault();
  //   theGame.playTurn(6);
  // });
  // $("#ind-7").click(function() {
  //   event.preventDefault();
  //   theGame.playTurn(7);
  // });
  // $("#ind-8").click(function() {
  //   event.preventDefault();
  //   theGame.playTurn(8);
  // });
});
