const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cors = require('cors');

app.use(express.static('dist'));
app.use(cors());
console.log("********",path.join(__dirname, 'dist'))
app.get('/', (req, res) => {
  // console.log("********",path.join(__dirname, 'dist', 'index.html'))
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);