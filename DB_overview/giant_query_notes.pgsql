	SELECT
		style_id,
		json_build_object('skus',json_object_agg(id, json_build_object('size', size, 'quantity', quantity)))
	FROM selectedskus
	WHERE product_id = 15
	GROUP BY style_id
	ORDER BY style_id;

