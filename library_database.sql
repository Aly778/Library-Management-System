USE library_system;

-- 1. Categories Table
CREATE TABLE Categories (
    Cid INT PRIMARY KEY AUTO_INCREMENT,
    Cname VARCHAR(100) NOT NULL,
    Cparent_id INT NULL 
);



-- 2. Users Table (Handles Super Admin, Admin, and Customer)
CREATE TABLE Users (
    Uid INT PRIMARY KEY AUTO_INCREMENT,
    Urole ENUM('admin' , 'superAdmin' , 'customer') DEFAULT 'customer',
    Ufirst_name VARCHAR(50),
    Ulast_name VARCHAR(50),
    Uphone_number VARCHAR(20),
    Udob DATE,
    Uemail VARCHAR(100) UNIQUE,
    Upassword VARCHAR(255),
    gender enum ('male','female')
);

-- 3. Books Table
CREATE TABLE Books (
    Bid INT PRIMARY KEY AUTO_INCREMENT,
    Cid INT,
    Bname VARCHAR(255) NOT NULL,
    Bprice DECIMAL(10, 2),
    Bpages INT , 
    Bpublish_date DATE,
    Bquantity INT,
    Btotal_quantity INT,
    Bdescription VARCHAR(255),
    Bimage VARCHAR(255),
    BAuthor VARCHAR(255),
    FOREIGN KEY (Cid) REFERENCES Categories(Cid)
);

-- 4. Authors Table
CREATE TABLE Authors (
    Aid INT PRIMARY KEY AUTO_INCREMENT,
    Aname VARCHAR(100) NOT NULL
);

-- 5. Book_Authors (Many-to-Many Relationship)
CREATE TABLE Book_Authors (
    Bid INT,
    Aid INT,
    PRIMARY KEY (Bid, Aid),
    FOREIGN KEY (Bid) REFERENCES Books(Bid) ON DELETE CASCADE,
    FOREIGN KEY (Aid) REFERENCES Authors(Aid) ON DELETE CASCADE
);

-- 6. Purchase_Books
CREATE TABLE Purchase_Books (
    Pid INT PRIMARY KEY AUTO_INCREMENT,
    Uid INT,
    Bid INT,
    Pdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Pprice DECIMAL(10, 2), -- Price at the time of purchase
    Pquantity INT,
    FOREIGN KEY (Uid) REFERENCES Users(Uid),
    FOREIGN KEY (Bid) REFERENCES Books(Bid)
);

-- 7. Borrow_Books Table
CREATE TABLE Borrow_Books (
    borrow_id INT PRIMARY KEY AUTO_INCREMENT,
    Uid INT, 
    Bid INT, 
    borrow_date DATE NOT NULL,
    exp_date DATE NOT NULL, -- Expected return date
    submitting_date DATE NULL, -- Actual return date
    borrow_status ENUM('Borrowed', 'Returned', 'Overdue') DEFAULT 'Borrowed',
    FOREIGN KEY (Uid) REFERENCES Users(Uid),
    FOREIGN KEY (Bid) REFERENCES Books(Bid)
);


INSERT INTO Users (Urole, Ufirst_name, Ulast_name, Uphone_number, Udob, Uemail, Upassword, gender) VALUES
('admin', 'Bola', 'database', '0000000', '1985-03-15', 'Bola@library.com', 'Bolapass', 'male'),
('superAdmin', 'Sama', 'tester', '00001212', '1990-07-22', 'Sama@library.com', 'Samapass', 'female'),
('customer', 'Aly', '1', '555-0103', '2303020', 'Aly1@customer.com', 'Aly1pass', 'male');

INSERT INTO Categories (Cname, Cparent_id) VALUES
('Biography', NULL),
('History', NULL),
('Romance', 1),  
('Database Systems', 4); 

INSERT INTO Authors (Aname) VALUES
('Stephen King'),
('J.K. Rowling'),
('George R.R. Martin'),
('Yuval Noah Harari'),
('Malcolm Gladwell'),
('Andy Weir');

INSERT INTO Books (Cid, Bname, Bprice, Bpages, Bpublish_date, Bquantity, Btotal_quantity, Bdescription, Bimage, BAuthor) VALUES
(1, 'The Shining', 150, 447, '1977-01-28', 5, 10, 'A classic horror novel about a haunted hotel', 'https://img1.od-cdn.com/ImageType-100/1191-1/%7B970AE6F8-8A83-4D0B-BD99-1907DBF12645%7DIMG100.JPG', 'Stephen King'),
(1, 'Harry Potter and the Sorcerer''s Stone', 100, 309, '1997-06-26', 8, 15, 'The first book in the Harry Potter series', 'https://img1.od-cdn.com/ImageType-400/3450-1/%7B622708F6-78D7-453A-A7C5-3FE6853F3167%7DIMG400.JPG', 'J.K. Rowling');

# UPDATE Users SET Urole = 'superAdmin' WHERE Uemail = 'Kylie@example.com';

# SELECT * FROM library_system.Users;

# update library_system.Books SET Bquantity = 3 WHERE Bid = 1;
# SELECT * FROM  library_system.Books WHERE Bid = 1;
/*
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Users;

SET FOREIGN_KEY_CHECKS = 1;
*/

#Alter table Users Modify Uphone_number bigint;

#UPDATE Users SET Urole = 'superAdmin' WHERE Uemail = 'Marwa@Mamdouh.com';
