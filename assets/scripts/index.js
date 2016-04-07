'use strict';

const events = require('./events');
const flow = require('./flow-control');

// On document ready
$(() => {
  // Show the start screen
  flow.startScreen();

  // Create Sign In Handlers
  events.signInHandlers();

  // Create Game Handlers
  events.gameHandlers();
});
