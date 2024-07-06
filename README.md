# comments-app

# Comment System with Authentication and File Upload

## Overview

This application is a comment system built with Express.js, WebSocket, PostgreSQL, and Sequelize ORM. It includes features such as user authentication using JWT tokens, CAPTCHA validation, and file uploads. The application ensures security against XSS attacks and SQL injections.

## Features

1. **User Authentication**: Users can register and log in using JWT tokens.
2. **Comment System**: Users can post comments, reply to comments, and sort them by various criteria.
3. **CAPTCHA Validation**: CAPTCHA is used to prevent automated submissions.
4. **File Uploads**: Users can upload images (JPG, GIF, PNG) and text files (TXT).
5. **WebSocket Integration**: Real-time updates for comments.
6. **Pagination and Sorting**: Comments can be paginated and sorted.
7. **Security**: Protection against XSS attacks and SQL injections.

## Installation

### Prerequisites

- Node.js
- PostgreSQL
- Docker

### Setup

1. **Clone the repository:**

   https://github.com/jeka-leb/comments-app.git

   RUN:
   npm run start:dev - for development
   npm run start:prod - for production
   npm run debug - for debugging

### Installation

API Endpoints

Authentication

POST /auth/register: Register a new user.
POST /auth/login: Log in an existing user and receive a JWT token.

Comments

GET /comments: Get comments.
GET /comments?page=1&pageSize=25&sortField=createdAt&sortOrder=desc: Get comments with pagination and sorting.
POST /comments: Post a new comment (requires authentication and CAPTCHA).

CAPTCHA

GET /captcha: Get a new CAPTCHA.

# Testing

## WebSockets

To test WebSocket functionality, you can WebSocket clients in browsers.

Connect to WebSocket:

websocat ws://localhost:3000

## CAPTCHA Testing with Postman

### Generate CAPTCHA:

GET /captcha

### Submit Comment with CAPTCHA:

POST /comments

Include the CAPTCHA text from the previous step in the request body.
Project Structure

### FLOW

1. Register user via /auth/register
2. Log in user to get valid JWT via /auth/login
3. Get captcha via /captcha
4. Post new comment using JWT in the format: Berear <JWT>

### Pull Docker image

docker pull jekaleb/comments

### Project Structure

.
├── controllers
│ ├── authController.js
│ ├── commentController.js
│ ├── errorController.js
│ └── ...
├── events
│ ├── commentEvents.js
│ └── listeners.js
├── middleware
│ ├── authMiddleware.js
│ ├── captchaMiddleware.js
│ └── xssProtectionMiddleware.js
├── models
│ ├── comment.js
│ ├── file.js
│ ├── session.js
│ ├── user.js
│ └── ...
├── routes
│ ├── authRoutes.js
│ ├── captchaRoutes.js
│ ├── commentRoutes.js
│ └── ...
├── utils
│ ├── db.js
│ └── appError.js
├── views
│ ├── index.html
│ └── ...
├── .env
├── app.js
├── server.js
├── Dockerfile
└── README.md
