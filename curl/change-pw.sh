curl --include --request PATCH http://tic-tac-toe.wdibos.com/change-password/277 \
  --include \
  --request PATCH \
  --header "Authorization: Token token=$TOKEN" \
  --header "Content-Type: application/json" \
  --data "{ \"passwords\": {
      \"old\": \"bob\",
      \"new\": \"lob\"
    }
  }"
