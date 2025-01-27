npm init > name the project  and so on
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



-------------------------------------------------------------------

Express development: the request response cycle 

Incoming request : for a rececived request  a request and a response object is created , in order to process the data middle ware is used , which can modify the data before sending a response 

 All the middlewware that is used is called a middleware stack 
 order of execution of middleware depends in there position in the code , it is fcfs

request  a request and a response object passes through each middleware , there is a next() in middle ware , this function will be executed with exact same request and response object


last middle ware is route handler , that next is not called here 

then the request response cycle is over

------------
third party midleware function  morgan (allows to see reqeust in the console)
=======================================================================
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

------------------------------
prettier and eslint configuration
npm i eslint prettier eslint-config-prettier eslint-plugin-prettier
---------------------------------------
about mongodb 

its a nosql database > conllections(tables) > documents(rows) has a bson struture

mongodb is a document based database , stores data in documents (field-value pair data structure , nosql).

easy to distribute data across multiple machines 

no document data schema required ,so each document can have different number and type of fields

preformant :embedded data models, indexing , sharding, flexing documents , native duplicaiton etc

embedding /denormalizing : including related data into single document.

----------------
using compass

--------------------------------


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

