require('dotenv').config()
const express = require('express');
const app = express();
const port = 3005;
const path = require('path');
const db = require("./DB_overview/dbmethod.js")

// app.use(express.static('dist'));
app.use(express.json());
const cors = require('cors');
app.use(cors());


app.get('/loaderio-ccb0914874e2092f3c030579f99a2266.txt', async (req, res) => {
  try {
    console.log("Send file", path.join(__dirname, 'loaderio-ccb0914874e2092f3c030579f99a2266.txt'))
    res.status(200).sendFile(path.join(__dirname, 'loaderio-ccb0914874e2092f3c030579f99a2266.txt'))
  } catch (err) {
    console.log("Error getting styles:", err, style, req.params.product_id)
  }
  // res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/api/products/:product_id', async (req, res) => {
  try {
    var product = await db.PRODUCT(req.params.product_id)
    res.status(200).send(JSON.stringify(product))

  } catch(err) {
    console.log("Error getting product:", req.params.product_id, " || Error: ", err)
  }


  // res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/api/products/:product_id/styles', async (req, res) => {
  try {
    var style = await db.PRODUCT_STYLE(req.params.product_id)
    res.status(200).send(JSON.stringify(style))
  } catch (err) {
    console.log("Error getting styles:", err, style, req.params.product_id)
  }
  // res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/api/products/:product_id/related', async (req, res) => {
  try {
    var related = await db.RELATED_PRODUCT(req.params.product_id)
    // console.log("Related product",req.params.product_id)
    res.status(200).send(JSON.stringify(related))
  } catch (err) {
    console.log("Error getting related product:", err)
  }
});


app.post('/api/cart', async (req, res) => {
  try {
    var cart = await db.CART(req.body.user_token, req.body.sku_id)
    res.status(200).send(JSON.stringify(related))
  } catch (err) {
    console.log("Error getting related product:", err)
  }
});



app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
