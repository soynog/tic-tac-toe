download watcher file and add export module line
create watcher object
add on change and on error functions
  for on change function, handle three different types of data
  if heartbeat, ignore
  if timeout, end game
  if game update, update game state
    prevent game updates while it's not your turn
HTML/CSS/structural changes:
  Play online option
  Host vs. join a game
  In game, Display game ID#, primary player name, and player letter
    getPlayer('o' or 'x') helper function returns email addy
