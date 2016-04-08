<!-- download watcher file and add export module line -->
<!-- join online game as player O -->
<!-- differentiate somehow between online games vs. hotseat games -->
<!-- create watcher object for that game -->
<!-- add on change and on error functions -->
  <!-- for on change function, handle three different types of data -->
  <!-- if heartbeat, ignore -->
  <!-- if timeout, end game -->
  <!-- if game update, update game state -->
    <!-- prevent game updates while it's not your turn -->
<!-- HTML/CSS/structural changes: -->
  <!-- Join game online option -->
  <!-- Option to wait for someone to join rather than logging in a
  second player from your comp.-->
  <!-- In game, Display game ID#, primary player name, and player letter -->
    <!-- getPlayer('o' or 'x') helper function returns email addy -->
Modify join game to allow you to re-join games remotely.
Need to update api.joinGame so that it knows whether to add in user O
 or just sign into the game. But always creates a watcher.
