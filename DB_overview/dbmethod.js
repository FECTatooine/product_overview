const db = require("./db.js");


var getProduct = async (product_id) => {
  var queryStr = "SELECT * FROM product where id = $1";
  try {
    var result = await db.query(queryStr, [product_id]);
    return result.rows[0]
  } catch(err) {
    console.log("Database error: getProduct, ", err)
  }
}

var getStyle = async (product_id) => {
  // var queryStr = "SELECT style_id, array_agg(json_build_object(id,json_build_object('size',size,'quantity', quantity))) FROM selectedskus WHERE product_id = $1 GROUP BY style_id ORDER BY style_id;";
   var queryStr = 'SELECT * FROM style where product_id = $1';
  try {
    var result = await db.query(queryStr, [product_id])
    // console.log('product id', product_id,result.rows);
    return result.rows
  } catch(err) {
    console.log("Database error: getStyle, ", err)
  }
}

var getFeature = async (product_id) => {
  var queryStr = "SELECT * FROM features WHERE product_id = $1";
  try {
    var result = await db.query(queryStr, [product_id])
    return result.rows
  } catch(err) {
    console.log("Database error: getStyle, ", err)
  }
}


var getSkus = async (product_id) => {
  var queryStr = "SELECT style_id, array_agg(json_build_object(id,row_to_json(selectedskus.*))) FROM selectedskus WHERE product_id = $1 GROUP BY style_id ORDER BY style_id;";
  try {
    var result = await db.query(queryStr, [product_id])
    return result.rows
  } catch(err) {
    console.log("Database error: getStyle, ", err)
  }
}

// getSkus(5);

var getPhoto = async (product_id) => {
  var queryStr = "SELECT style_id,array_agg(row_to_json(selectedphoto.*)) FROM selectedphoto WHERE product_id = $1 GROUP BY style_id ORDER BY style_id;";
  try {
    var result = await db.query(queryStr, [product_id])

    return result.rows
  } catch(err) {
    console.log("Get Photo Error, ", err)
  }

}

var getSkusAndPhoto = async (product_id) => {
  var queryStr = "SELECT photo.style_id, json_build_object('skus', product_skus.json_object_agg, 'photos', photo.array_agg) FROM (SELECT style_id, json_object_agg(id, json_build_object('size', size, 'quantity', quantity)) FROM selectedskus WHERE product_id = $1 GROUP BY style_id ORDER BY style_id) as product_skus, (SELECT style_id, array_agg(json_build_object('url', url, 'thumbnail_url', thumbnail_url)) FROM selectedphoto WHERE product_id = $1 GROUP BY style_id ORDER BY style_id) as photo WHERE product_skus.style_id = photo.style_id;"

  try {
    var result = await db.query(queryStr, [product_id])
    return result.rows
  } catch(err) {
    console.log("Get Skus+Photo Error, ", err)
  }
}

var getRelated = async (product_id) => {
  var queryStr = "SELECT array_agg(related_id) from related where curr_id = $1;";
  try {
    var result = await db.query(queryStr, [product_id])
    return result.rows[0].array_agg
  } catch(err) {
    console.log("Database error: getStyle, ", err)
  }
}

var postCart = async (usertoken, skusid) => {
  var queryStr0 = "SELECT setval('\"cart_id_seq\"', (SELECT MAX(id) FROM cart)+1);"
  var queryStr = "INSERT INTO cart(user_session, sku_id, active) VALUES ($1, $2, 1);";
  try {
    await db.query(queryStr0)
    await db.query(queryStr, [usertoken, skusid])
  } catch(err) {
    console.log("Error postCart: ", err)
  }
}

// getPhoto(15);
// style = [{id:, product_id:, name:, sale_price:, original_price:, default_style:}]
// skus = [{style_id: , array_agg: [{ id: {size:, quantity:, }}]}]
// photo = [{style_id:, array_agg: [{photo_id(id):, style_id, url:, thumbnail_url:}]]


var PRODUCT = async (product_id) => {
  var product_id = product_id || 1;
  var product = await getProduct(product_id);
  product.features = await getFeature(product_id);
  return product;
}

var PRODUCT_STYLE = async (product_id) => {
  var product_id = product_id || 1;
  var style = await getStyle(product_id);
  var photo = await getPhoto(product_id);
  var skus = await getSkus(product_id);
  var styles = {"product_id": product_id}
  styles.results = style;
  for (var i = 0; i < style.length; i++) {

    styles.results[i].photos = photo[i].array_agg || [];

    for (var j = 0; j < skus[i].array_agg.length; j++) {
      styles.results[i].skus = {...styles.results[i].skus, ...skus[i].array_agg[j]};
    }
  }
  return styles;
}

var PRODUCT_STYLE2 = async (product_id) => {
  var product_id = product_id || 1;
  var style = await getStyle(product_id);
  var skusAndPhoto = await getSkusAndPhoto(product_id);
  var styles = {"product_id": product_id, results: style};
  if (skusAndPhoto.length && style.length) {
    for (var i = 0; i < style.length; i++) {
      if (skusAndPhoto[i] !== undefined) {
        styles.results[i] = {...style[i], ...skusAndPhoto[i].json_build_object};
      } else {
        styles.results[i] = {...style[i], skus:{}, photos:[]};
      }
    }
  }

  return styles;
}
PRODUCT_STYLE2(3)
var RELATED_PRODUCT = async (product_id) => {
  var product_id = product_id || 1;
  var result = await getRelated(product_id)
  return result;
}

var CART = async (user_token, sku_id) => {
  var user_token = user_token || 1234;
  var sku_id = sku_id || 1;
  var result = await postCart(user_token, sku_id)
  return result;
}

module.exports = {
  PRODUCT: PRODUCT,
  PRODUCT_STYLE: PRODUCT_STYLE2,
  RELATED_PRODUCT: RELATED_PRODUCT
};