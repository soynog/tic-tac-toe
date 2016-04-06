WDI Project 1: TIC TAC TOE
~~Nicolas Garcia~~

**Outline of App Structure**
index.html:
  All HTML for the app is contained in this one file. The app is a SPA, dynamically updating the page (by hiding and showing sections) in response to user actions.

index.js:
  References jquery, getFormFields function, and javascript script files.

assets/scripts:
  Several scripts are used to log users in and play games of tic-tac-toe.

  ./index.js:
    Loads the event handlers necessary to receive user input.

  ./events.js:
    Creates event handlers for all login/logout forms as well as the buttons that make up the tic-tac-toe board.

  ./display.js:
    Contains functions for altering the DOM in response to user input. E.g. hiding and displaying HTML elements, updating the board state, and displaying announcements.

  ./app-data.js:
    Creates an app object for holding data about the current game and users.

  ./auth/*
    Scripts in this folder make AJAX calls to the API as appropriate based on user actions (./api.js). Then, ./ui.js controls flow and makes calls to update the viewstate based on the response from the API.

  ./game/ticatactoe.js
    tictactoe.js provides helper functions for playing a tictactoe game--such as checking if a move is valid, or if a player has won.

assets/styles:
  The stylesheets in this folder are separated functionally into layout, typography, and color scheme sheets.

curl:
  These curl scripts were used in development to test communication with the API.
