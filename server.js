const express = require('express');


const PORT = 3000;
const app = express();


app.listen(PORT, () => {
  console.log('Listening on port 3000');
});

app.get('/', (req, res) => {
  res.send('Hello, world');
});
