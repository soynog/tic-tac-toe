curl --include --request POST http://localhost:3000/books \
  --data-urlencode "book[title]=$TITLE" \
  --data-urlencode "book[author]=$AUTHOR"
