# Quiz Manager

BCS Level 4 Software Developer Synoptic Project.

## Description

The Quiz Manager is a basic web-page app which uses Node.js, Express, and a MongoDB to manage quiz creation and access based on different authentication levels. Admin level users are able to create new users, create/edit/delete quizzes, and view the full quiz including answers. Assistant level users are able to view the full quiz including answers. Student level users are only able to view questions.

## Getting Started

### Executing program

* Run 
```
npm install
``` 
first to install necessary packages

* Run
```
npm start
```
to start project - It will stay running until you use ctrl + c to stop it using the nodemon dependency

* Preview the login.html page from the src folder - If you require login details, please contact me

## Acknowledgments

* [Thank you to Bryan Dijkhuizen from Medium for helping me learn more about hooking up to Mongo](https://javascript.plainenglish.io/create-an-authentication-api-using-node-js-express-mongodb-and-jwt-1d52124d402e)