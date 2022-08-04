

CREATE TABLE IF NOT EXISTS product (
  id serial PRIMARY KEY,
  name VARCHAR(100),
  slogan VARCHAR(1000),
  description VARCHAR(1000),
  category VARCHAR(20),
  default_price INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS style (
  id serial PRIMARY KEY,
  product_id INT,
  name VARCHAR(100),
  sale_price VARCHAR(20),
  original_price VARCHAR(20),
  default_style BOOLEAN
);

CREATE TABLE IF NOT EXISTS features (
  id serial PRIMARY KEY,
  product_id INTEGER,
  feature VARCHAR(255),
  value VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS skus (
  id serial PRIMARY KEY,
  style_id INTEGER,
  size VARCHAR(20),
  quantity INTEGER
);

CREATE TABLE IF NOT EXISTS photos (
  id serial PRIMARY KEY,
  style_id INTEGER,
  url TEXT,
  thumbnail_url TEXT
);

CREATE TABLE IF NOT EXISTS related (
  id serial PRIMARY KEY,
  curr_id INTEGER,
  related_id INTEGER
);

CREATE TABLE IF NOT EXISTS cart (
  id serial PRIMARY KEY,
  user_session INTEGER,
  sku_id INTEGER,
  active INTEGER
);

COPY product(id, name, slogan, description, category, default_price)
FROM '/Users/kaisheng/hello/supernova-retail-app/data/product.csv'
DELIMITER ','
CSV HEADER;

COPY skus(id, style_id, size, quantity)
FROM '/Users/kaisheng/hello/supernova-retail-app/data/skus.csv'
DELIMITER ','
CSV HEADER;

COPY features(id, product_id, feature, value)
FROM '/Users/kaisheng/hello/supernova-retail-app/data/features.csv'
DELIMITER ','
CSV HEADER;

COPY photos(id, style_id, url, thumbnail_url)
FROM '/Users/kaisheng/hello/supernova-retail-app/data/photos.csv'
DELIMITER ','
CSV HEADER;

COPY style(id, product_id, name, sale_price, original_price, default_style)
FROM '/Users/kaisheng/hello/supernova-retail-app/data/styles.csv'
DELIMITER ','
CSV HEADER;

COPY related(id, curr_id, related_id)
FROM '/Users/kaisheng/hello/supernova-retail-app/data/related.csv'
DELIMITER ','
CSV HEADER;

COPY cart(id, user_session, sku_id, active)
FROM '/Users/kaisheng/hello/supernova-retail-app/data/cart.csv'
DELIMITER ','
CSV HEADER;

ALTER TABLE style ADD FOREIGN KEY (product_id) REFERENCES product(id);
ALTER TABLE features ADD FOREIGN KEY (product_id) REFERENCES product(id);
ALTER TABLE skus ADD FOREIGN KEY (style_id) REFERENCES style(id);
ALTER TABLE photos ADD FOREIGN KEY (style_id) REFERENCES style(id);
ALTER TABLE related ADD FOREIGN KEY (curr_id) REFERENCES product(id);
ALTER TABLE cart ADD FOREIGN KEY (sku_id) REFERENCES skus(id);


SELECT skus.id, skus.style_id, skus.size, skus.quantity, style.product_id
INTO selectedSkus
FROM skus
left JOIN style
ON style.id = skus.style_id;
DROP TABLE skus;

SELECT photos.id, photos.style_id, photos.url, photos.thumbnail_url, style.product_id
INTO selectedphoto
FROM photos
left JOIN style
ON style.id = photos.style_id;
DROP TABLE photos;

CREATE INDEX photo_idx ON selectedphoto(product_id);
CREATE INDEX skus_idx ON selectedskus(product_id)
CREATE INDEX features_idx ON features(product_id);
CREATE INDEX product_idx ON product(id);
CREATE INDEX related_idx ON related(id);
CREATE INDEX style_idx ON style(product_id);


-- SELECT
-- 	style_id,
-- 	array_agg(size || ' '|| quantity)
-- FROM selectedskus
-- WHERE product_id = 15
-- GROUP BY style_id
-- ORDER BY style_id;

-- SELECT
-- 	style_id,
-- 	array_agg(json_build_object(id,json_build_object('size',size,'quantity', quantity)))
-- FROM selectedskus
-- WHERE product_id = 15
-- GROUP BY style_id
-- ORDER BY style_id;

-- SELECT
--   style_id,
--   array_agg(json_build_object(id,row_to_json(selectedskus.*)))
-- FROM selectedskus
-- WHERE product_id = $1
-- GROUP BY style_id
-- ORDER BY style_id;

-- SELECT
--   style_id,
--   array_agg(row_to_json(selectedphoto.*))
-- FROM selectedphoto
-- WHERE product_id = 15
-- GROUP BY style_id
-- ORDER BY style_id;

-- -- This gives perfect table, one column of style id, the other column of objects that contains (skusid:{size, quantity})
-- SELECT
-- 	style_id,
-- 	json_object_agg(id, json_build_object('size', size, 'quantity', quantity))
-- FROM selectedskus
-- WHERE product_id = 15
-- GROUP BY style_id
-- ORDER BY style_id;

-- --  GET related product
-- SELECT
-- 	array_agg(related_id)
-- from related
-- where curr_id = 1