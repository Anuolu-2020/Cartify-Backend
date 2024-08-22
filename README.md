# Cartify Backend

Welcome to Cartify Backend! This repository contains the backend codebase for Cartify, an ecommerce platform designed to make online shopping seamless and enjoyable.

## Features

- **User Authentication:** Secure user authentication and authorization system.
- **Product Management:** Manage products, categories, and inventory.
- **Order Processing:** Handle orders, payments, and shipping 
- **RESTful APIs:** Well-structured RESTful APIs for seamless integration with frontend applications.
- **Security:** Implement robust security measures to protect user data and transactions.
- **Scalability:** Built with scalability in mind to handle a growing number of users and transactions.
- **Notification:** Built in email service for notifying customers on signup and successful order.

## Technologies Used

- **Programming Language:** Typescript, NodeJs.
- **Framework:** Express.js.
- **Database:** MongoDB
- **Authentication:** Paseto tokens
- **Bucket:** Firebase Storage
- **Deployment:** Render with Docker
- **Payments:** Paystack
- **Error Tracking:** Sentry
- **Email Gateway Provider:** Mailgun

## Getting Started

To get started with Cartify Backend, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/cartify-backend.git

2. **Install Dependencies:** 

``` bash
    cd cartify-backend
    npm install
```
3. **Build Project:** 

``` bash
    npm run build
```

4. **Set Environment Variables:**
  Create a .env file in the root directory and add the necessary environment variables, including database connection URI, session secret, redis connection string,Node_Env, firebase config etc. 

5. **Run the Server:**
 ``` bash
    npm run start:dev #development mode
  
    npm run start:prod #production mode
```
6. **Testing:**
Use tools like Postman to test the APIs. Refer to the API documentation for available endpoints and request/response formats. **(Coming Soon)**
   
