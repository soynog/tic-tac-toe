curl --include --request PATCH http://tic-tac-toe.wdibos.com/games/$ID \
  --include \
  --request PATCH \
  --header "Authorization: Token token=$TOKEN" \
  --header "Content-Type: application/json" \
  --data "{
     \"game\": {
      \"cell\": {
        \"index\": 0,
        \"value\": \"x\"
      },
      \"over\": false
    }
  }"
