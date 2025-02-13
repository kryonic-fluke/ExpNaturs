npm init > name the project and so on
then download exp js
npm i express

convention to have all the exp configuration in app.js

Whats an api >Application programming interfaceAPI and RESTful API Concepts
API (Application Programming Interface)

Definition: A piece of software that allows different applications to communicate with each other

REST (Representational State Transfer)
RESTful API Principles:

Resource-Based Design

Divide data into logical resources
Use structured, resource-based URLs
Use appropriate HTTP methods for actions

Endpoint Naming Conventions

Use resource names, not verbs
Examples:

/tours (not /getTours)
Unique identifiers allowed (e.g., /tours/123)

HTTP Methods

POST: Create new resource
PUT: Update entire object
PATCH: Update partial object
DELETE: Remove resource

CRUD Operations
Create, Read, Update, Delete
JSON Best Practices

Lightweight data interchange format
Keys must be strings
Values can have different types

Response Formatting

JSEND: Status, message, data object
Other formats: JSON:API, OData JSON protocol

Key Principles

Stateless:

Each request must contain all processing information
Server doesn't remember previous states
Client handles state management

Corrections and Improvements:

---

Express development: the request response cycle

Incoming request : for a rececived request a request and a response object is created , in order to process the data middle ware is used , which can modify the data before sending a response

All the middlewware that is used is called a middleware stack
order of execution of middleware depends in there position in the code , it is fcfs

request a request and a response object passes through each middleware , there is a next() in middle ware , this function will be executed with exact same request and response object

last middle ware is route handler , that next is not called here

then the request response cycle is over

---

# third party midleware function morgan (allows to see reqeust in the console)

special type of middleware : param middleware

that only runs for certain parameter

==============================================
accessing static file using express, files in file system that can not be accessed through url

anything that has nothing to do with express is done outside the app.js

env is set by express

to get var set by node , process.env

whenever we need some configuration changed based on enviroment that app is running in, we use different env variable

all the env variables can be defined in env file , and to connect the env file to the node application use package called dotenv
then require dottenv in app.js

---

prettier and eslint configuration
npm i eslint prettier eslint-config-prettier eslint-plugin-prettier

---

about mongodb

its a nosql database > conllections(tables) > documents(rows) has a bson struture

mongodb is a document based database , stores data in documents (field-value pair data structure , nosql).

easy to distribute data across multiple machines

no document data schema required ,so each document can have different number and type of fields

preformant :embedded data models, indexing , sharding, flexing documents , native duplicaiton etc

embedding /denormalizing : including related data into single document.

---

using compass

---

# MVC (Model-View-Controller) Architecture

## Core Components

### Model Layer

- Contains business logic
- Handles data-related operations
- Implements business rules and data manipulation
- Represents the application's data structure

### Controller Layer

- Handles application logic
- Processes incoming requests
- Interacts with models to get/manipulate data
- Sends responses back to clients
- Acts as intermediary between Model and View

### View Layer

- Handles presentation logic
- Contains templates for rendering GUI
- Only necessary for server-side rendered websites
- Responsible for how data is presented to users

## Request Flow in MVC

1. Request arrives at application
2. Router receives request and routes to appropriate controller
3. Controller (handler function) processes the request
4. Controller interacts with Model if data access/manipulation needed
5. For server-side rendering:
   - Controller gets template from View
   - Data is injected into template
   - Rendered page sent as response
6. Response sent back to client

## Separation of Logic

### Application Logic (Controllers)

- Manages technical aspects of how the application works
- Handles HTTP requests and responses
- Routes and middleware implementation
- Bridge between Model and View layers
- Request/response handling
- Data formatting and validation

### Business Logic (Models)

- Implements core business rules and requirements
- Handles data relationships and validation
- Manages data transformations
- Implements business calculations and operations
- Data validation rules
- Complex operations specific to business domain

## Best Practices

### Fat Model, Thin Controller Principle

- Keep controllers simple and focused
- Move complex logic to models
- Controllers should mainly:
  - Receive requests
  - Call appropriate model methods
  - Send responses
- Models should contain:
  - Data validation
  - Business calculations
  - Complex operations
  - Data relationships

### Benefits of MVC

- Clear separation of concerns
- Improved code organization
- Better maintainability
- Easier testing
- Scalable architecture
- Reusable components

Pagination : ?page=2,limit=50 (limit is the amount of document, page no. represents which page is shown among available pages)

---

The aggregation pipeline is a framework in MongoDB for processing data. It consists of a series of stages that documents from a specified collection pass through sequentially. Each stage performs a specific operation on the documents, transforming them into an aggregated result. The pipeline allows for complex data transformations and computations, enabling developers to filter, group, sort, and analyze data effectively.

used to calculate averages , min , max ,distances and all kind of stuff

---

virtual properties: fields that we can define in our schema , that will not be persisted , not be saved into database.

## for derieved states

Mongooose middleware: can make something happen between two events , like each time some document is saved, we can run a function betweeen the save command issued and actuall saving of the documents, thats why middleware are called pre and post hook

we can define function to run before or after an event

4 types :document , query, aggregate, model

documentsacts on currently processing documents

query middleware runs a function before and after a query is executed

---

validation for data that is coming to our model
Data Validation:

Checks if data meets specified criteria and constraints
Ensures data is in the correct format, range, and type
Verifies data integrity and accuracy
Happens BEFORE saving to database

=======================
Data Sanitization:

Cleans and modifies input data to make it safe and consistent
Removes malicious code or unwanted characters
Standardizes data format
Happens BEFORE validation

---

Error handeling
break points , where our code stops running

 error handling in Express applications, emphasizing centralized management of errors. Here are the key points:

Previous Error Handling: Earlier methods involved sending error messages directly from route handlers as JSON, which is inefficient.

Types of Errors:

Operational Errors: Predictable issues stemming from user actions, system failures, or network problems (e.g., invalid routes, incorrect data input). These should be anticipated and handled proactively.
Programming Errors: Bugs caused by developers (e.g., referencing undefined variables, misuse of asynchronous functions). Recognizing the difference between these errors is crucial for effective handling.
Focus on Operational Errors: In Express, managing operational errors is emphasized as they are easier to capture.

Global Error Handling Middleware: Express offers built-in middleware to centralize error management, catching errors from various parts of the application like route handlers and model validators.

Informative Responses: Effective error handling involves sending informative responses to clients, which may include options like retrying, crashing the server, or ignoring the error.

Separation of Concerns: The global middleware allows developers to keep business logic separate from error handling, promoting cleaner code.

Implementation Encouragement: The lecture ends by encouraging the implementation of this centralized error handling approach in Express applications.

-------------------- 
unhandeled rejections : promises that are unsucecessfull might occur outside expres, example mongodb data connection 

---------------
uncaught exceptions : errors or bugs that are in our syncgronous code and not handeled anywhere

---------------------------------------

JWT (JSON Web Token): Stateless Authentication

JWTs enable stateless authentication, meaning the server doesn't need to store session information for each logged-in user. This simplifies server-side management and makes scaling easier.

Login Process:

User Credentials: The user sends their login credentials (email and password) to the server via a POST request.

Authentication: The server verifies the credentials against its database.

JWT Creation: If the credentials are valid, the server creates a JWT. This token contains information about the user (e.g., user ID, username) and is digitally signed using a secret key.  This signature ensures the token's integrity and prevents tampering.

Token Delivery: The server sends the JWT back to the client (usually in the response body or as a cookie).

Client Storage: The client stores the JWT (typically in local storage or as an HTTP-only cookie).  HTTP-only cookies are generally preferred for security, as they are not accessible via JavaScript, mitigating XSS attacks.

Accessing Protected Resources:

Request with Token: When the user wants to access a protected resource (e.g., their profile), the client includes the JWT in the Authorization header of the HTTP request (usually using the Bearer scheme: Authorization: Bearer <token>).

Token Verification: The server receives the request and extracts the JWT. It then verifies the token's signature using the same secret key that was used to create it.  This confirms that the token is valid and hasn't been tampered with.

Data Retrieval: If the token is valid, the server can extract the user information (e.g., user ID) from the token's payload.  It then uses this information to retrieve the requested data (e.g., the user's profile) from the database.

Response: The server sends the requested data back to the client.


JWT Structure: A JWT is composed of three parts:

JWT (JSON Web Token) Security

JWTs are designed with security in mind, but it's important to understand how the different parts contribute to this security.

JWT Structure and Encoding:

Header: Contains metadata about the token, including the type of token and the hashing algorithm used for signing.  It's Base64 encoded, not encrypted.  This means it's readable (though not easily decipherable without knowing the structure), but it can't be directly modified without detection.

Payload: Contains the claims, which are statements about an entity (typically, the user) and additional data.  It's also Base64 encoded.  Like the header, it's readable but protected from tampering by the signature.  Crucially, you should never store sensitive information (like passwords) in the payload.

Signature: Ensures the integrity of the token.  It's created by taking the Base64 encoded header and payload, combining them with a secret key (that only the server knows), and applying a cryptographic hashing algorithm (like HMAC-SHA256). The signature is not encrypted; it's a digital signature.

JWT Creation:

The server generates the header and payload (as JSON objects).
The header and payload are Base64 encoded.
The server uses the signing algorithm (e.g., HMAC-SHA256) and the secret key to create the signature.
The header, payload, and signature are concatenated (separated by periods) to form the JWT.
JWT Verification:

Request with JWT: The client sends the JWT in the Authorization header (using the Bearer scheme) with each request to a protected resource.

Server Receives JWT: The server receives the JWT.

Token Decomposition: The server splits the JWT into its three parts: header, payload, and signature.

Signature Recreation: The server takes the Base64 encoded header and payload from the received JWT, combines them with its own copy of the secret key, and applies the same hashing algorithm that was used to create the JWT.  This generates a new signature.

Signature Comparison: The server compares the newly generated signature with the original signature that was included in the JWT.

Authentication: If the two signatures match, it means that the header and payload have not been tampered with since the JWT was created. The server can then trust the claims in the payload (e.g., the user ID) and grant access to the requested resource.  If the signatures don't match, the JWT is considered invalid, and the request is rejected.
-------------------------------

Athentication starts : login

package : jsonwebtoken  , jwt.sign method to create a new token



=------------------------------------------------------

reset password : user sends a post request to forgot route m that will create a reset token and will send the email address that is provided , Note is a simple web token not a jwt

then user sendsd the token from the email along with new password oinorder to update his password , 

----
package node mailer and mailtrap

---------------
we use different routes for updating password and updating user data such as email 
----------------------------------------------
Security Best practises

1) Compromised databse : attacker got access to the data base :
 strongly encrypt password with salt and hash(bcrypt)
 strongly encrypt password reset token (sha 256)

2)Brute Force Attracks 

 user bcrypt (to make login request slow)
  implement rate limiting (express-rate-limit)
  implement maximum login attempts

3)CROSS-SITE SCRIPTING(XSS) ATTACKS

  STORE JWT IN HTTPONLY COOKIES , never store json webtoken  in local strorage, by this browser can only send and receive the cookie but can not modify or change.
  SANITIZE USER INPUT DATA
  SET SPCIAL HTTP HEADERS (HELEMT PACKAGE)

4)denial of server (dos) attack 
implement rate limit
limit body payload 
avoid using evil regular expression


5) nosql  query injection 

use mongoose for mondodb (because of schema types)
sanitize user input data

always use https 
create random password token , give them expiry data


deny acces to jwt after the password change 
 dont commit sensitive config to gi

  do send error details to client 

  prevent corss site request forgery (csurf package)

  require re-authentucation begore a high-value action

  implement a blaclist of untrusted jwt

  confirm user email address after first creating account
   
   keep user logged in with refresh token 

   implement two factor in with refresh token 

  prevent  parameter polltuion causing uncaught expectation  

  ----------------------------
  cookie is a small peice of text that server can send to a client(browser) , after receiving it is automatically saved and sent back along with future request to the same server