'use strict';

const events = require('./events');

// On document ready
$(() => {
  // Create Sign In Handlers
  events.signInHandlers();

  // Create Game Handlers
  events.gameHandlers();
});
