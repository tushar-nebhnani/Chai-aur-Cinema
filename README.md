# Chai aur Cinema

Version: 1.0.0 Beta

## Foundation

This repository contains the foundational version of a BookMyShow-style web application clone. It includes a backend built with Node.js and Express, a PostgreSQL database connection, authentication flow, booking logic, and a frontend served from a simple static client.

## Features

- User registration and login
- JWT-based authentication
- Password reset and change support
- Seat selection and booking flow
- Email verification support
- Rate limiting and validation middleware

## Tech Stack

- Node.js
- Express
- PostgreSQL
- JWT authentication
- bcrypt password hashing
- Nodemailer email service
- Joi validation
- CORS and cookie handling

## Scripts

- `npm run db:init` - initialize the database
- `npm start` - start the development server with nodemon

## Project Structure

- `server.js` - application entry point
- `src/public` - frontend assets
- `src/server` - backend implementation, routes, middleware, and services

## Notes

This is version 1.0.0 Beta and represents the foundation of the app. Additional features and refinements can be added in future releases.
