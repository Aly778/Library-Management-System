# Library Management System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔑 Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phoneNumber": "+1234567890",
  "dob": "1990-01-15",
  "gender": "male"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully!",
  "user": {
    "Uid": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

---

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

## 📚 Books & Catalog Endpoints

### Get All Books
**GET** `/admin/books`

**Query Parameters:**
- `category` - Filter by category ID
- `search` - Search by title or author
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter

**Example:** `/admin/books?search=gatsby&category=1`

**Response:**
```json
{
  "success": true,
  "books": [
    {
      "Bid": 1,
      "Bname": "The Great Gatsby",
      "BAuthor": "F. Scott Fitzgerald",
      "Bprice": 12.99,
      "Bquantity": 5,
      "Bdescription": "A classic novel...",
      "Bimage": "url_to_image",
      "Cid": 1
    }
  ]
}
```

---

### Get Book Details
**GET** `/admin/books/:bookId`

**Response:**
```json
{
  "success": true,
  "book": {
    "Bid": 1,
    "Bname": "The Great Gatsby",
    "BAuthor": "F. Scott Fitzgerald",
    "Bprice": 12.99,
    "Bpages": 180,
    "Bpublish_date": "1925-04-10",
    "Bquantity": 5,
    "Btotal_quantity": 10,
    "Bdescription": "A classic novel of the Jazz Age",
    "Bimage": "url_to_image",
    "Cid": 1
  }
}
```

---

### Create Book (SuperAdmin Only)
**POST** `/admin/books`

**Headers:**
```
Authorization: Bearer <superadmin_token>
```

**Request Body:**
```json
{
  "categoryId": 1,
  "name": "New Book Title",
  "price": 19.99,
  "pages": 300,
  "publishDate": "2024-01-15",
  "quantity": 10,
  "description": "Book description",
  "author": "Author Name"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book added successfully!",
  "book": {
    "Bid": 2,
    "categoryId": 1,
    "name": "New Book Title",
    "price": 19.99
  }
}
```

---

### Update Book (SuperAdmin Only)
**PUT** `/admin/books/:bookId`

**Headers:**
```
Authorization: Bearer <superadmin_token>
```

**Request Body:**
```json
{
  "categoryId": 1,
  "name": "Updated Title",
  "price": 18.99,
  "pages": 320,
  "publishDate": "2024-01-15",
  "quantity": 8,
  "description": "Updated description",
  "author": "Author Name"
}
```

---

### Delete Book (SuperAdmin Only)
**DELETE** `/admin/books/:bookId`

**Headers:**
```
Authorization: Bearer <superadmin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Book deleted successfully"
}
```

---

### Get Categories
**GET** `/admin/books/categories/all`

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "Cid": 1,
      "Cname": "Fiction",
      "Cparent_id": null
    },
    {
      "Cid": 2,
      "Cname": "Non-Fiction",
      "Cparent_id": null
    }
  ]
}
```

---

### Get Inventory (Admin/SuperAdmin Only)
**GET** `/admin/books/stock/inventory`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "inventory": [
    {
      "bookId": 1,
      "name": "The Great Gatsby",
      "quantity": 5,
      "totalQuantity": 10,
      "price": 12.99
    }
  ]
}
```

---

## 🛒 Customer Endpoints

### Get Available Books
**GET** `/customer/books`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Response:**
```json
{
  "success": true,
  "books": [
    {
      "Bid": 1,
      "Bname": "The Great Gatsby",
      "Bprice": 12.99,
      "Bquantity": 5
    }
  ]
}
```

---

### Purchase Books
**POST** `/customer/purchase`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Request Body:**
```json
{
  "items": [
    {
      "Bid": 1,
      "quantity": 2
    },
    {
      "Bid": 2,
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Purchase completed successfully",
  "purchaseIds": [1, 2],
  "total": 45.97
}
```

---

### Get Purchase History
**GET** `/customer/purchases`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Response:**
```json
{
  "success": true,
  "purchases": [
    {
      "Pid": 1,
      "Bid": 1,
      "Bname": "The Great Gatsby",
      "BAuthor": "F. Scott Fitzgerald",
      "Pprice": 12.99,
      "Pquantity": 2,
      "Pdate": "2024-02-09T10:30:00Z"
    }
  ]
}
```

---

### Borrow Book
**POST** `/customer/borrow`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Request Body:**
```json
{
  "bookId": 1,
  "borrowDays": 14
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "borrow": {
    "borrowId": 1,
    "borrowDate": "2024-02-09",
    "expDate": "2024-02-23"
  }
}
```

---

### Get Borrowing History
**GET** `/customer/borrows`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Response:**
```json
{
  "success": true,
  "borrows": [
    {
      "borrow_id": 1,
      "Bid": 1,
      "Bname": "The Great Gatsby",
      "BAuthor": "F. Scott Fitzgerald",
      "borrow_date": "2024-02-09",
      "exp_date": "2024-02-23",
      "submitting_date": null,
      "borrow_status": "Borrowed"
    }
  ]
}
```

---

### Get Active Borrows
**GET** `/customer/active-borrows`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Response:**
```json
{
  "success": true,
  "activeBorrows": [
    {
      "borrow_id": 1,
      "Bname": "The Great Gatsby",
      "exp_date": "2024-02-23",
      "borrow_status": "Borrowed"
    }
  ]
}
```

---

### Return Book
**POST** `/customer/return/:borrowId`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Book returned successfully",
  "return": {
    "borrowId": 1,
    "status": "Returned",
    "returnDate": "2024-02-15"
  }
}
```

---

## Error Responses

### Unauthorized (401)
```json
{
  "success": false,
  "message": "No token, authorization denied"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Forbidden: Access denied"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Book not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error message"
}
```

---

## HTTP Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request parameters
- **401 Unauthorized** - Missing or invalid authentication
- **403 Forbidden** - Access denied
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

---

## Rate Limiting
Currently no rate limiting. Consider implementing in production.

---

## CORS Configuration
CORS is enabled for `http://localhost:3000` (frontend)

---

## Version
API Version: **1.0.0**
Last Updated: **February 9, 2026**
