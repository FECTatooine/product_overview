CREATE DATABASE overview;

CREATE TABLE product (
  id serial PRIMARY KEY,
  name VARCHAR(100),
  slogan VARCHAR(100),
  description VARCHAR(1000),
  category VARCHAR(20),
  default_price INTEGER DEFAULT 0,
  default_style INTEGER DEFAULT 0,
  style_id INTEGER [],
  features VARCHAR(50)[] -- ??key value pairs??
  related_product INTEGER [],
  default_style INTEGER, -- default style ID
)
CREATE TABLE style (
  id serial PRIMARY KEY,
  product_id INT,
  name VARCHAR(20),
  thumbnailURL TEXT,
  URL TEXT,
  original_price INTEGER,
  sale_price INTEGER,
  is_default_style BOOLEAN,
  skus INTEGER [], -- size and quantity id
  FOREIGN KEY (product_id) REFERENCES product(id)
)



CREATE TABLE skus (
  id serial PRIMARY KEY,
  style_id INTEGER,
  size VARCHAR(10),
  quantity INTEGER,
)

