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