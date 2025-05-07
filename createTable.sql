CREATE TABLE IF NOT EXISTS products (
    id INT(255) NOT NULL AUTO_INCREMENT,
    barcode VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    quantity INT(255) NOT NULL,
    saled_quantity INT(255) NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS promotions (
    id INT(255) NOT NULL AUTO_INCREMENT,
    product_barcode VARCHAR(255) NOT NULL,
    quantity INT(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (product_barcode) REFERENCES products(barcode)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS sales_schedule (
    id INT(255) NOT NULL AUTO_INCREMENT,
    total_sales DECIMAL(10,2) NOT NULL,
    total_profit DECIMAL(10,2) NOT NULL,
    amount_received DECIMAL(10,2) NOT NULL,
    change_amount DECIMAL(10,2) NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sold_items (
    id INT(255) NOT NULL AUTO_INCREMENT,
    sales_schedule_id INT(255) NOT NULL,
    product_barcode VARCHAR(255) NOT NULL,
    quantity INT(255) NOT NULL,
    total_sales DECIMAL(10,2) NOT NULL,
    total_profit DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (sales_schedule_id) REFERENCES sales_schedule(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (product_barcode) REFERENCES products(barcode)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);