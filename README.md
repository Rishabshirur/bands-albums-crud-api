This repository contains the source code for a simple Node.js API server that provides CRUD operations for managing bands and their albums.
This repo aims to practice separating concerns into different modules, using MongoDB for data storage, implementing async/await for asynchronous code, and building a RESTful API using Express.js.

## Features
- Separate modules for database connection, collections, and data manipulation.
- CRUD operations for managing bands and their albums.
- Error handling and input validation for all routes and data functions.
- Express.js routes for bands and albums API.
- MongoDB database with proper schema for bands and albums.

## Database Structure
The MongoDB database has the following structure:
- Collections:
  - `bands`: Stores band information with albums as a sub-document.
  - `albums`: Stores album information.

## Installation
To install dependencies, navigate to the project directory and run:
`npm install`

To seed the database with initial data, run:
`node seed.js`

To start the server, run:
`npm start`
