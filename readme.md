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

Corrected some minor spelling and formatting
Structured the information for better readability
Maintained the core technical content