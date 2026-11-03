/* QuickKartDB schema - Microsoft SQL Server */
IF DB_ID(N'QuickKartDB') IS NULL CREATE DATABASE QuickKartDB;
GO
USE QuickKartDB;
GO

CREATE TABLE dbo.users (
 id BIGINT IDENTITY(1,1) PRIMARY KEY,
 name NVARCHAR(100) NOT NULL,
 email NVARCHAR(160) NOT NULL UNIQUE,
 phone NVARCHAR(15) NOT NULL,
 password_hash NVARCHAR(255) NOT NULL,
 role NVARCHAR(20) NOT NULL CONSTRAINT DF_users_role DEFAULT 'CUSTOMER',
 active BIT NOT NULL CONSTRAINT DF_users_active DEFAULT 1,
 created_at DATETIME2 NOT NULL CONSTRAINT DF_users_created DEFAULT SYSUTCDATETIME(),
 CONSTRAINT CK_users_role CHECK (role IN ('CUSTOMER','ADMIN'))
);
CREATE TABLE dbo.categories (
 id BIGINT IDENTITY(1,1) PRIMARY KEY,
 name NVARCHAR(80) NOT NULL UNIQUE,
 description NVARCHAR(500) NULL,
 image_url NVARCHAR(500) NULL,
 active BIT NOT NULL CONSTRAINT DF_categories_active DEFAULT 1
);
CREATE TABLE dbo.products (
 id BIGINT IDENTITY(1,1) PRIMARY KEY,
 name NVARCHAR(180) NOT NULL,
 description NVARCHAR(3000) NOT NULL,
 price DECIMAL(12,2) NOT NULL,
 original_price DECIMAL(12,2) NULL,
 stock INT NOT NULL CONSTRAINT DF_products_stock DEFAULT 0,
 image_url NVARCHAR(700) NULL,
 category_id BIGINT NOT NULL,
 active BIT NOT NULL CONSTRAINT DF_products_active DEFAULT 1,
 created_at DATETIME2 NOT NULL CONSTRAINT DF_products_created DEFAULT SYSUTCDATETIME(),
 CONSTRAINT FK_products_categories FOREIGN KEY(category_id) REFERENCES dbo.categories(id),
 CONSTRAINT CK_products_price CHECK(price >= 0),
 CONSTRAINT CK_products_stock CHECK(stock >= 0)
);
CREATE TABLE dbo.addresses (
 id BIGINT IDENTITY(1,1) PRIMARY KEY,
 user_id BIGINT NOT NULL,
 full_name NVARCHAR(100) NOT NULL,
 phone NVARCHAR(15) NOT NULL,
 line1 NVARCHAR(250) NOT NULL,
 line2 NVARCHAR(250) NULL,
 city NVARCHAR(80) NOT NULL,
 state NVARCHAR(80) NOT NULL,
 postal_code NVARCHAR(10) NOT NULL,
 country NVARCHAR(60) NOT NULL CONSTRAINT DF_addresses_country DEFAULT 'India',
 default_address BIT NOT NULL CONSTRAINT DF_addresses_default DEFAULT 0,
 CONSTRAINT FK_addresses_users FOREIGN KEY(user_id) REFERENCES dbo.users(id)
);
CREATE TABLE dbo.cart_items (
 id BIGINT IDENTITY(1,1) PRIMARY KEY,
 user_id BIGINT NOT NULL,
 product_id BIGINT NOT NULL,
 quantity INT NOT NULL,
 CONSTRAINT FK_cart_users FOREIGN KEY(user_id) REFERENCES dbo.users(id),
 CONSTRAINT FK_cart_products FOREIGN KEY(product_id) REFERENCES dbo.products(id),
 CONSTRAINT UQ_cart_user_product UNIQUE(user_id,product_id),
 CONSTRAINT CK_cart_quantity CHECK(quantity > 0)
);
CREATE TABLE dbo.wishlist_items (
 id BIGINT IDENTITY(1,1) PRIMARY KEY,
 user_id BIGINT NOT NULL,
 product_id BIGINT NOT NULL,
 CONSTRAINT FK_wishlist_users FOREIGN KEY(user_id) REFERENCES dbo.users(id),
 CONSTRAINT FK_wishlist_products FOREIGN KEY(product_id) REFERENCES dbo.products(id),
 CONSTRAINT UQ_wishlist_user_product UNIQUE(user_id,product_id)
);
CREATE TABLE dbo.orders (
 id BIGINT IDENTITY(1,1) PRIMARY KEY,
 order_number NVARCHAR(40) NOT NULL UNIQUE,
 user_id BIGINT NOT NULL,
 address_id BIGINT NOT NULL,
 status NVARCHAR(30) NOT NULL,
 payment_method NVARCHAR(20) NOT NULL,
 subtotal DECIMAL(12,2) NOT NULL,
 delivery_charge DECIMAL(12,2) NOT NULL,
 total DECIMAL(12,2) NOT NULL,
 created_at DATETIME2 NOT NULL CONSTRAINT DF_orders_created DEFAULT SYSUTCDATETIME(),
 CONSTRAINT FK_orders_users FOREIGN KEY(user_id) REFERENCES dbo.users(id),
 CONSTRAINT FK_orders_addresses FOREIGN KEY(address_id) REFERENCES dbo.addresses(id),
 CONSTRAINT CK_orders_status CHECK(status IN ('PLACED','CONFIRMED','PACKED','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED')),
 CONSTRAINT CK_orders_payment CHECK(payment_method IN ('COD','ONLINE'))
);
CREATE TABLE dbo.order_items (
 id BIGINT IDENTITY(1,1) PRIMARY KEY,
 order_id BIGINT NOT NULL,
 product_id BIGINT NOT NULL,
 product_name NVARCHAR(180) NOT NULL,
 unit_price DECIMAL(12,2) NOT NULL,
 quantity INT NOT NULL,
 CONSTRAINT FK_order_items_orders FOREIGN KEY(order_id) REFERENCES dbo.orders(id),
 CONSTRAINT FK_order_items_products FOREIGN KEY(product_id) REFERENCES dbo.products(id),
 CONSTRAINT CK_order_items_quantity CHECK(quantity > 0)
);
CREATE INDEX IX_products_category_active ON dbo.products(category_id,active);
CREATE INDEX IX_orders_user_created ON dbo.orders(user_id,created_at DESC);
CREATE INDEX IX_orders_status ON dbo.orders(status);
GO
INSERT INTO dbo.categories(name,description) VALUES
(N'Electronics',N'Electronics products'),(N'Home',N'Home products'),(N'Beauty',N'Beauty products'),(N'Fashion',N'Fashion products'),(N'Groceries',N'Groceries products');
GO
