curl --include --request POST http://tic-tac-toe.wdibos.com/sign-in \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data "{ \"credentials\": {
      \"email\": \"art@art.art\",
      \"password\": \"art\"
    }
  }"
