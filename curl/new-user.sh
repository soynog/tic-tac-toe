curl --include --request POST http://tic-tac-toe.wdibos.com/sign-up \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data "{ \"credentials\": {
      \"email\": \"bob@bob.bob\",
      \"password\": \"bob\",
      \"password_confirmation\": \"bob\"
    }
  }"
