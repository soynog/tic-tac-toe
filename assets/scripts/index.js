'use strict';

const gameEvents = require('./game/game-events');
const authEvents = require('./auth/auth-events');

// On document ready
$(() => {
  // Create Sign In Handlers
  authEvents.signInHandlers();

  // Create Game Handlers
  gameEvents.gameHandlers();
  
});
