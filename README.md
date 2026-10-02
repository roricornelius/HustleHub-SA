# HustleHub SA

### A Full-Stack C2C Marketplace Web Application for South Africa

HustleHub SA is a **customer-to-customer (C2C) online marketplace** developed to provide users with a platform for buying and selling products directly with one another.

The project was developed as an **academic software engineering project** as part of a Bachelor of Science in Information Technology programme. It demonstrates the design and development of a full-stack web application, including frontend development, backend APIs, database management, user authentication, marketplace functionality, and administrative management.

**Live Website:** [HustleHub SA](https://hustlehub-sa.infinityfreeapp.com/)

**Repository:** [GitHub](https://github.com/roricornelius/HustleHub-SA)

---

## 📌 Project Overview

HustleHub SA was designed around the idea of creating a simple and accessible marketplace where individuals can list products for sale and interact with potential buyers.

The platform provides functionality for users to:

* Create and manage accounts
* Browse available products
* Search and view marketplace listings
* Create product listings
* Manage their profiles
* Add products to a shopping cart
* Place and manage orders
* Communicate with other users
* Receive notifications
* Manage their listings and purchases

The application also includes an **administrative interface** for managing users, listings, orders, and other platform data.

---

## ✨ Key Features

### 👤 User Management

* User registration
* User login
* User profiles
* Profile management
* User roles
* Account-related functionality

### 🛍️ Marketplace

* Browse marketplace listings
* View individual product pages
* Product categories
* Product information
* Search functionality
* Product listing creation
* Product listing management

### 🛒 Shopping & Orders

* Add products to cart
* View cart contents
* Manage cart items
* Place orders
* View order information
* Track order-related information

### 💬 Communication

* User-to-user messaging
* Notifications
* User interactions related to marketplace activity

### ⭐ User Interaction

* Ratings and reviews
* Following functionality
* Seller/buyer interaction

### 🔐 Administration

The project includes a dedicated administrative area providing functionality for managing the marketplace, including:

* User management
* Role management
* Listing management
* Order management
* Reports
* Administrative controls

---

## 🏗️ Application Architecture

HustleHub follows a client-server architecture consisting of a frontend, backend API layer, and relational database.

```text
┌─────────────────────────────────────────────┐
│                  Frontend                   │
│                                             │
│ HTML5 · CSS3 · JavaScript · Bootstrap 5     │
└──────────────────────┬──────────────────────┘
                       │
                       │ HTTP Requests
                       ▼
┌─────────────────────────────────────────────┐
│                Backend / API                │
│                                             │
│                 PHP                         │
│          REST-style API endpoints           │
└──────────────────────┬──────────────────────┘
                       │
                       │ SQL Queries
                       ▼
┌─────────────────────────────────────────────┐
│                  Database                   │
│                                             │
│                  MySQL                      │
└─────────────────────────────────────────────┘
```

The application separates frontend presentation from backend processing and database operations, allowing the frontend to communicate with server-side functionality through API endpoints.

---

## 🛠️ Technologies Used

### Frontend

* **HTML5** — Page structure and semantic markup
* **CSS3** — Custom styling and responsive layouts
* **JavaScript** — Client-side functionality and API interaction
* **Bootstrap 5** — Responsive UI components and layout

### Backend

* **PHP** — Server-side application logic
* **PHP API endpoints** — Communication between the frontend and backend
* **PDO** — Database connectivity and SQL operations

### Database

* **MySQL** — Relational database management
* Relational database design
* Foreign-key relationships
* CRUD operations
* SQL queries

### Development & Deployment

* **Git** — Version control
* **GitHub** — Source-code management and repository hosting
* **InfinityFree** — Web hosting/deployment

---

## 📁 Project Structure

```text
HustleHub-SA/
│
├── admin/                 # Administrative dashboard and functionality
│
├── api/                   # PHP backend/API endpoints
│
├── css/                   # Stylesheets
│
├── database/              # Database schema and SQL files
│
├── images/                # Application images and media
│
├── js/                    # JavaScript functionality
│
├── .gitattributes
├── .gitignore
├── .htaccess
│
├── index.html             # Homepage
├── listings.html          # Marketplace listings
├── product.html           # Product page
├── cart.html              # Shopping cart
├── orders.html            # Orders
├── sell.html              # Create/manage listings
├── profile.html           # User profile
├── messages.html          # Messaging
├── notifications.html     # Notifications
├── login.html             # Login
├── register.html          # Registration
│
└── README.md
```

---

## 🔄 Core User Flow

A typical marketplace interaction follows this process:

```text
User Registration
       │
       ▼
    Login
       │
       ▼
Browse Marketplace
       │
       ▼
View Product
       │
       ├───────────────┐
       ▼               ▼
Add to Cart        Contact Seller
       │
       ▼
Place Order
       │
       ▼
Manage Order
```

Sellers can independently create listings and manage products available on the marketplace.

---

## 🗄️ Database

The application uses **MySQL** as its relational database.

The database is responsible for storing and managing information required by the marketplace, including users, products/listings, orders, order items, reports, and other application data.

The database design uses relationships between entities to maintain consistency and support marketplace operations.

The SQL/database resources are available in:

```text
/database/
```

---

## 🔌 API

The backend API is located in:

```text
/api/
```

The API provides server-side functionality used by the frontend to perform operations such as:

* User authentication
* User management
* Listing management
* Product retrieval
* Order operations
* Messaging
* Notifications
* Other marketplace functionality

Frontend JavaScript communicates with these backend endpoints to retrieve and submit application data.

---

## 🔐 Security Considerations

Security was considered throughout the development of the application, including:

* Database access through PDO
* Prepared SQL statements
* Authentication functionality
* Role-based application functionality
* Server-side API processing
* `.htaccess` configuration

> **Important:** This project was developed primarily as an academic application and should not be considered production-ready without further security auditing and hardening.

For a production deployment, additional measures would be recommended, including comprehensive input validation, secure session management, CSRF protection, rate limiting, security headers, secrets management, logging, and additional authorization checks.

---

## 🚀 Running the Project Locally

### Prerequisites

To run HustleHub locally, you will need:

* A local web server such as **XAMPP**, **WAMP**, or **Laragon**
* PHP
* MySQL
* A modern web browser
* Git

### 1. Clone the repository

```bash
git clone https://github.com/roricornelius/HustleHub-SA.git
```

### 2. Move the project into your web server directory

For example, with XAMPP:

```text
C:/xampp/htdocs/HustleHub-SA/
```

### 3. Start the required services

Start:

* Apache
* MySQL

from your local server environment.

### 4. Create the database

Open your MySQL administration interface, such as phpMyAdmin, and create the required database.

Import the SQL/database files located in:

```text
/database/
```

### 5. Configure the database connection

Update the database configuration used by the PHP API with your local MySQL credentials.

Example configuration:

```php
$host = "localhost";
$dbname = "your_database";
$username = "your_username";
$password = "your_password";
```

**Do not commit real passwords, API keys, or other secrets to GitHub.**

### 6. Run the application

Open the application through your local web server:

```text
http://localhost/HustleHub-SA/
```

---

## 🌐 Live Demo

A deployed version of the application is available at:

**[HustleHub SA](https://hustlehub-sa.infinityfreeapp.com/)**

> The live deployment is provided primarily as a demonstration of the project and may differ from a production deployment.

---

## 📸 Screenshots

Screenshots can be added here to showcase the main functionality of the application.

Recommended screenshots include:

1. Homepage
2. Marketplace listings
3. Product page
4. User profile
5. Create listing page
6. Shopping cart
7. Orders
8. Messaging
9. Notifications
10. Admin dashboard

Example:

```markdown
![HustleHub Homepage](images/screenshots/homepage.png)
```

---

## 🧪 Testing

The application was tested during development to verify the functionality of key user workflows.

Testing areas include:

* User registration
* User login
* Product/listing creation
* Product browsing
* Product search
* Cart functionality
* Order functionality
* Messaging
* Notifications
* Profile functionality
* Administrative functionality
* Database operations

Further automated testing and comprehensive security testing would be appropriate for a production release.

---

## 📈 Future Improvements

Potential future improvements include:

### Security

* Implement stronger authentication/session management
* Add CSRF protection
* Improve input validation and sanitisation
* Add rate limiting
* Implement more granular authorization
* Introduce secure secrets/environment-variable management
* Add security headers

### Marketplace

* Online payment integration
* Seller verification
* Advanced product filtering
* Product image management
* Wishlist functionality
* Location-based marketplace search
* Improved seller profiles

### User Experience

* Improved responsive design
* Accessibility improvements
* Improved notifications
* Better search experience
* Real-time messaging

### Technical Improvements

* Automated unit and integration testing
* API documentation
* Improved backend architecture
* CI/CD pipeline
* Containerisation with Docker
* Cloud deployment
* Migration toward a modern frontend framework such as React

---

## 🎓 Academic Context

HustleHub SA was developed as an **Information Technology academic project** to demonstrate practical application of software development principles.

The project provided experience in:

* Requirements analysis
* Web application development
* Frontend development
* Backend development
* API development
* Database design
* SQL
* Authentication
* CRUD operations
* User interface design
* Software architecture
* Version control
* Application deployment

---

## 💡 Skills Demonstrated

This project demonstrates practical experience with:

```text
Frontend Development
        │
        ├── HTML5
        ├── CSS3
        ├── JavaScript
        └── Bootstrap

Backend Development
        │
        ├── PHP
        ├── API Development
        └── Server-side Logic

Database Development
        │
        ├── MySQL
        ├── SQL
        ├── Database Relationships
        └── CRUD Operations

Software Engineering
        │
        ├── Application Architecture
        ├── Authentication
        ├── Version Control
        └── Deployment
```

---

## 👨‍💻 Author

**Rori Cornelius**

Bachelor of Science in Information Technology
Software Engineering

GitHub: [@roricornelius](https://github.com/roricornelius)

---

## 📄 Project Status

**Status:** Completed academic project / ongoing portfolio development

HustleHub SA was initially developed as an academic project and is being maintained as part of a professional software development portfolio.

Future development may focus on improving the application's security, architecture, user experience, testing, and deployment.

---

## ⚠️ Disclaimer

HustleHub SA is an academic and portfolio project.

It is not intended to process real financial transactions or sensitive production data. The deployed demonstration environment should be treated as a development/demo environment rather than a production marketplace.

---

## 📜 License

This project is currently provided for **academic and portfolio purposes**.

If you intend to reuse, modify, or redistribute the project, please contact the author for permission.
