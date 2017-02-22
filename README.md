# Document Management System API.
[![Build Status](https://travis-ci.org/andela-uenabulele/document-management-system.svg?branch=master)](https://travis-ci.org/andela-uenabulele/document-management-system)
[![Coverage Status](https://coveralls.io/repos/github/andela-uenabulele/document-management-system/badge.svg?branch=master)](https://coveralls.io/github/andela-uenabulele/document-management-system?branch=master)
[![Code Climate](https://codeclimate.com/github/andela-uenabulele/document-management-system/badges/gpa.svg)](https://codeclimate.com/github/andela-uenabulele/document-management-system)


Document Management System provides a restful API for users to create and manage documents giving different privileges based on user roles and managing authentication using JWT.

## Technologies Used
- JavaScript (ES6)
- Node.js
- Express
- Postgresql
- Sequelize ORM.  

## Local Development
### Prerequisites includes
- [Postgresql](https://www.postgresql.org/) and
-  [Node.js](http://nodejs.org/) >= v6.8.0.

### Procedure
1. Clone this repository from a terminal `git clone git@github.com:andela-uenabulele/document-management-system.git`.
1. Move into the project directory `cd document-management-system`
1. Install project dependencies `npm install`
1. Create Postgresql database and run migrations `npm run db:migrations`.
1. Start the express server `npm start`.
1. Run test `npm test`.

### Postman Collection
[![Run in Postman](https://run.pstmn.io/button.svg)][postman-link]

Create a Postman environment and set `url` and `token` variables or download and import a production environment from this [link][postman-env-link]

## Deployment
Deploy this project to Heroku by clicking the button below.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/andela-uenabulele/document-magement-system)

Set a `SECRET_TOKEN` environmet variable, and create a Postgresql add-on.

---

# API Documentation
The API has routes, each dedicated to a single task that uses HTTP response codes to indicate API status and errors.

## Authentication
Users are assigned a token when signup or signin. This token is needed for subsequent HTTP requests to the API for authentication and can be attached as values to the header's `x-acess-token` or `authorization` key. API requests made without authentication will fail with the status code `401: Unauthorized Access`.

## Below are the API endpoints and their functions
EndPoint                      |   Functionality
------------------------------|------------------------
POST /api/users/login         |   Logs a user in.
POST /api/users/logout        |   Logs a user out.
POST /api/users/              |   Creates a new user.
GET /api/users/               |   Find matching instances of user.
GET /api/users/<id>           |   Find user.
PUT /api/users/<id>           |   Update user attributes.
DELETE /api/users/<id>        |   Delete user.
POST /api/documents/          |   Creates a new document instance.
GET /api/documents/           |   Find matching instances of document.
GET /api/documents/<id>       |   Find document.
PUT /api/documents/<id>       |   Update document attributes.
DELETE /api/documents/<id>    |   Delete document.
GET /api/users/<id>/documents |   Find all documents belonging to the user.
GET /search/users/<term>      |   Gets all users with full Names contain the search term
GET /search/roles/:term       |   Get all roles with title containing the search term
GET /search/document/:userId/:term| Get all document owned by `userId` with title containing the search term
GET /search/documents/:term | Get all documents with title containing the search term
GET /search/documents/:userId/:term |   Get all document owned or accessible by `userId` with title containing the search term


The following are some sample request and response from the API.

- [Roles](#roles)
  - [Get roles](#get-roles)

- [Users](#users)
  - [Create user](#create-user)
  - [Get user](#get-user)

- [Documents](#documents)
  - [Get All documents](#get-all-documents)
  - [Create document](#create-document)
  - [Get document](#get-document)
  - [Edit document](#edit-document)
  - [Delete document](#delete-document)

- [Search](#search)
  - [Search Documents](#search-documents)
  - [Search Users] (#search-users)


## Roles
Endpoint for Roles API.

### Get Roles

#### Request
- Endpoint: GET: `/api/roles`
- Requires: Authentication

#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
[
  {
    "id": 1,
    "title": "Admin",
    "createdAt": "2016-12-06T06:44:54.792Z",
    "updatedAt": "2016-12-06T06:44:54.792Z"
  }, {
    "id": 2,
    "title": "Registered",
    "createdAt": "2016-12-06T06:44:54.792Z",
    "updatedAt": "2016-12-06T06:44:54.792Z"
  }
]
```

## Users
Endpoint for Users API.

### Create User

#### Request
- Endpoint: POST: `api/users`
- Body `(application/json)`
```json
{
  "username": "uniqueuser",
  "fullNames": "Unique User",
  "email": "uniqueuser@unique.com",
  "RoleId": 1,
  "password": "password"
}
```

#### Response
- Status: `201: Created`
- Body `(application/json)`
```json
{
  "user": {
    "id": 141,
    "username": "uniqueuser",
    "fullNames": "Unique User",
    "email": "uniqueuser@unique.com",
    "RoleId": 1,
    "createdAt": "2017-02-19T17:34:19.992Z",
    "updatedAt": "2017-02-19T17:34:19.992Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjE0MSwiUm9sZUlkIjoxLCJpYXQiOjE0ODc1MjU2NjAsImV4cCI6MTQ4NzY5ODQ2MH0.ddCQXZB2_woJ32xZNHqPBhNXfjBRg6T3ZsSmF8GCplA",
  "expiresIn": "2 days"
}
```

### Get Users

#### Request
- Endpoint: GET: `api/users`
- Requires: Authentication, Admin Role

#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
[{
  "id": 140,
  "username": "uyi2",
  "fullNames": "wuyi2AH",
  "email": "uyi2@uyi.com",
  "RoleId": 1,
  "password": "$2a$08$ErbiyXkXAXsGXLoG2VOIIucUwzaCXGJz.d5YKkL/0SQIM3xhdbib2",
  "createdAt": "2017-02-17T19:41:30.837Z",
  "updatedAt": "2017-02-17T19:41:30.837Z"
},
{
  "id": 141,
  "username": "uniqueuser",
  "fullNames": "Unique User",
  "email": "uniqueuser@unique.com",
  "RoleId": 1,
  "password": "$2a$08$eggCuipNKnau7CJcxGVaUeEssqo5OjbQedfV1.gGNT2GNTyloD6MS",
  "createdAt": "2017-02-19T17:34:19.992Z",
  "updatedAt": "2017-02-19T17:34:19.992Z"
}]
```

## Documents
Endpoint for document API.

### Get All Documents

#### Request
- Endpoint: GET: `/api/documents`
- Requires: Authentication, Admin Role

#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
[{
    "id": 45,
    "title": "Another new document",
    "content": "Test Epic things like lorem etc",
    "permission": "Public",
    "OwnerId": 29,
    "createdAt": "2017-02-17T17:40:45.146Z",
    "updatedAt": "2017-02-17T17:40:45.146Z"
  },
  {
    "id": 44,
    "title": "New Title",
    "content": "The unique content of a document does not lie in the presence of the word unique",
    "permission": "1",
    "OwnerId": 1,
    "createdAt": "2017-02-06T22:55:43.747Z",
    "updatedAt": "2017-02-06T22:55:43.747Z"
  }]
```

### Create Document

#### Request
- Endpoint: POST: `/api/documents`
- Requires: Authentication
- Body `(application/json)`
```json
{
  "title": "Just a Title",
  "content": "This placeholder should not always be a lorem generated document",
  "OwnerId": 1,
  "permission": "private"
}
```

#### Response
- Status: `201: Created`
- Body `(application/json)`
```json
{
  "id": 1,
  "title": "Just a Title",
  "content": "This placeholder should not always be a lorem ipsum generated document",
  "OwnerId": 1,
  "permission": "private",
  "createdAt": "2017-02-05T05:51:51.217Z",
  "updatedAt": "2016-02-05T05:51:51.217Z"
}
```


### Get Document

#### Request
- Endpoint: GET: `/api/documents/:id`
- Requires: Authentication

#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
{
  "id": 1,
  "title": "Just a Title",
  "content": "This placeholder should not always be a lorem ipsum generated document",
  "OwnerId": 1,
  "permission": "private",
  "createdAt": "2017-02-05T05:51:51.217Z",
  "updatedAt": "2016-02-05T05:51:51.217Z"
}
```

### Edit Document

#### Request
- Endpoint: PUT: `/api/documents/:id`
- Requires: Authentication
- Body `(application/json)`:
```json
{
  "title": "Updated Title",
}
```

#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
  {
    "id": 1,
    "title": "Updated Title",
    "content": "This placeholder should not always be a lorem ipsum generated document",
    "OwnerId": 1,
    "permission": "private",
    "createdAt": "2017-02-05T05:51:51.217Z",
    "updatedAt": "2016-02-05T05:51:51.217Z"
  }
```

### Delete Document

#### Request
- Endpoint: DELETE: `/api/documents/:id`
- Requires: Authentication

#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
{
  "message": "Deleted Document with id:42"
}
```


### Search
#### Documents

#### Request
- Endpoint: GET: `/search/documents/:term`
- Requires: Authentication

#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
[{
    "id": 45,
    "title": "Another new document",
    "content": "Test Epic things like lorem etc",
    "permission": "Public",
    "OwnerId": 29,
    "createdAt": "2017-02-17T17:40:45.146Z",
    "updatedAt": "2017-02-17T17:40:45.146Z"
  },
  {
    "id": 44,
    "title": "New Title",
    "content": "The unique content of a document does not lie in the presence of the word unique",
    "permission": "1",
    "OwnerId": 1,
    "createdAt": "2017-02-06T22:55:43.747Z",
    "updatedAt": "2017-02-06T22:55:43.747Z"
  }]
```

### Users

#### Request
- Endpoint: GET: `/search/users/:term`
- Requires: Authentication, Admin Role

#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
[{
  "id": 140,
  "username": "uyi2",
  "fullNames": "wuyi2AH",
  "email": "uyi2@uyi.com",
  "RoleId": 1,
  "password": "$2a$08$ErbiyXkXAXsGXLoG2VOIIucUwzaCXGJz.d5YKkL/0SQIM3xhdbib2",
  "createdAt": "2017-02-17T19:41:30.837Z",
  "updatedAt": "2017-02-17T19:41:30.837Z"
},
{
  "id": 141,
  "username": "uniqueuser",
  "fullNames": "Unique User",
  "email": "uniqueuser@unique.com",
  "RoleId": 1,
  "password": "$2a$08$eggCuipNKnau7CJcxGVaUeEssqo5OjbQedfV1.gGNT2GNTyloD6MS",
  "createdAt": "2017-02-19T17:34:19.992Z",
  "updatedAt": "2017-02-19T17:34:19.992Z"
}]
```
