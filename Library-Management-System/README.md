# Library Management System

A full-featured library management system built with **Node.js**, **Express**, and **EJS** templating. It provides both student-facing and admin-facing interfaces for browsing, purchasing, and managing books.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

**Production mode:**

```bash
npm start
```

**Development mode** (auto-restarts on file changes):

```bash
npm run dev
```

The server will start on **http://localhost:3000** by default.  
To use a different port, set the `PORT` environment variable:

```bash
PORT=4000 npm start
```

## Application Screens

Once the server is running, you can access the following pages:

### Authentication

| Screen   | URL                                |
| -------- | ---------------------------------- |
| Login    | http://localhost:3000/login        |
| Sign Up  | http://localhost:3000/signup       |

### Customer Pages

| Screen            | URL                                |
| ----------------- | ---------------------------------- |
| Book Catalog      | http://localhost:3000/catalog      |
| Shopping Cart     | http://localhost:3000/cart         |
| Checkout          | http://localhost:3000/checkout     |
| Purchase History  | http://localhost:3000/history      |

### Admin Pages

| Screen                  | URL                                |
| ----------------------- | ---------------------------------- |
| Admin Dashboard         | http://localhost:3000/dashboard    |
| Inventory Management    | http://localhost:3000/inventory    |

> **Note:** The Admin Dashboard includes an **Add New Staff Member** modal, and the Inventory page includes **Add Book** and **Edit Book** modals accessible via their respective buttons.


## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Templating:** EJS
- **Styling:** Tailwind CSS (via CDN)
- **Icons:** Google Material Symbols
- **Font:** Inter (Google Fonts)
