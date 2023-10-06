CREATE DATABASE ProjectDmc;
USE ProjectDmc;

CREATE TABLE ReceiptDetail (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    receiptId INT(11),
    productId INT(11),
    quantity INT(11),
    price BIGINT(11),
    createAt DATETIME,
    updateAt DATETIME,
    FOREIGN KEY (receiptId) REFERENCES Receipt(id),
    FOREIGN KEY (productId) REFERENCES Products(id)
);

CREATE TABLE Supplier (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255),
    phonenumber VARCHAR(10),
    email VARCHAR(255),
    createAt DATETIME,
    updateAt DATETIME
); 

CREATE TABLE Users (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(255),
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    address VARCHAR(255),
    phonenumber VARCHAR(255),
    image LONGBLOB,
    dob VARCHAR(255),
    roleid VARCHAR(255),
    statusid VARCHAR(255),
    isactiveemail TINYINT(1),
    usertoken VARCHAR(255),
    createdAt DATETIME,
    updatedAt DATETIME
); --idone

CREATE TABLE Brand (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nameBrand VARCHAR(255),
    description VARCHAR(255),
    createdAt DATETIME,
    updatedAt DATETIME
); --idone

CREATE TABLE AddressUser (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    shipName VARCHAR(255),
    shipAddress VARCHAR(255),
    shipEmail VARCHAR(255),
    shipPhoneNumber VARCHAR(255),
    createAt DATETIME,
    updateAt DATETIME,
    user_id INT(11),
    FOREIGN KEY (user_id) REFERENCES Users(id)
); 

CREATE TABLE Category (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nameCategory VARCHAR(255),
    description VARCHAR(255),
    createAt DATETIME,
    updateAt DATETIME
); --idone

CREATE TABLE Products (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    contentHTML LONGTEXT,
    contentMarkdown LONGTEXT,
    statusId VARCHAR(255),
    categoryId INT(11),
    view INT(11),
    madeby VARCHAR(255),
    material VARCHAR(255),
    brandId INT(11),
    createAt DATETIME,
    updateAt DATETIME,
    FOREIGN KEY (categoryId) REFERENCES Category(id),
    FOREIGN KEY (brandId) REFERENCES Brand(id)
); --idone

CREATE TABLE ProductsDetail (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    productId INT(11),
    description LONGTEXT,
    nameDetail VARCHAR(255),
    productDetailSize INT(11),
    originalPrice BIGINT(20),
    createAt DATETIME,
    updateAt DATETIME,
    FOREIGN KEY (productId) REFERENCES Products(id)
); --idone

CREATE TABLE ProductDetailSize (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    productDetailId INT(11),
    width VARCHAR(255),
    height VARCHAR(255),
    sizeId VARCHAR(255),
    createAt DATETIME,
    updateAt DATETIME,
    FOREIGN KEY (productDetailId) REFERENCES ProductsDetail(id)
);

CREATE TABLE OrderProducts (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INT(11),
    statusId VARCHAR(255),
    voucherId INT(11),
    addressUserId INT(11),
    note VARCHAR(255),
    isPaymentOnline INT(11),
    createAt DATETIME,
    updateAt DATETIME,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (addressUserId) REFERENCES AddressUser(id)
);

CREATE TABLE OrderDetail (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    orderId INT(11),
    productId INT(11),
    quantity INT(11),
    realPrice BIGINT(20),
    createAt DATETIME,
    updateAt DATETIME,
    FOREIGN KEY (orderId) REFERENCES OrderProducts(id),
    FOREIGN KEY (productId) REFERENCES Products(id)
);

CREATE TABLE ProductImages (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    caption VARCHAR(255),
    productDetailId INT(11),
    image LONGBLOB,
    createAt DATETIME,
    updateAt DATETIME,
    FOREIGN KEY (productDetailId) REFERENCES ProductsDetail(id)
); --idone
CREATE TABLE Receipt (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INT(11),
    supplierId INT(11),
    createdAt DATETIME,
    updatedAt DATETIME,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (supplierId) REFERENCES Supplier(id)
);
CREATE TABLE ShopCarts (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INT(11),
    productId INT(11),
    quantity INT(11),
    statusId VARCHAR(255),
    createAt DATETIME,
    updateAt DATETIME,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (productId) REFERENCES Products(id)
);


Labhesh:
ReceiptDetail
user
Receipt
Brand

Hieu:
AddressUser
Products
ProductsDetail
ProductDetailSize
ProductImages

Siddhesh:
Category
OrderProducts
OrderDetail

Abhishek:
Supplier
ShopCarts

