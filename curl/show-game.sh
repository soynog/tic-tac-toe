curl --include --request GET http://tic-tac-toe.wdibos.com/games/$ID \
  --include \
  --request GET \
  --header "Authorization: Token token=$TOKEN"
