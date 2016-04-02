curl --include --request PATCH http://localhost:3000/books/$ID \
--header "Content-Type: application/json" \
--data '{
  "book": {
    "title": "Calvin and Hobbes",
    "author": "Bill Watterson"
  }
}'
