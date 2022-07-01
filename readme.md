# Quiz Manager

BCS Level 4 Software Developer Synoptic Project.

## Description

The Quiz Manager is a basic web-page app which uses Node.js, Express, and a MongoDB to manage quiz creation and access based on different authentication levels. Admin level users are able to create new users, create/edit/delete quizzes, and view the full quiz including answers. Assistant level users are able to view the full quiz including answers. Student level users are only able to view questions. Necessary files have been included in submission to BCS however some files have not been uploaded to the git repo for security reasons, therefore this project will not run if just cloned. 

## Getting Started

### Dependencies

* bcrypt.js - Used to hash password information
* cors - Used to prevent CORS errors in the browser
* dotenv - Used to interact with .env file
* express - Used to help with routing
* jsonwebtoken - Used to help with authentication setup
* node-fetch - Used to help with route calls
* mongoose - Used to interact with Mongo databases
* @hapi/joi - Used for validating data
* nodemon - Used to keep program running, allows developer to keep local server running without having to restart on save

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

## Ideas for future iterations

1.	The ability to administer quizzes online
a.	Needs a system that allows users to select the correct answer when creating a quiz question- This would require correct answer to be denoted within the database item and UI update
b.	Feature allowing admin users to mass-update the permissions of student users from viewing only question to viewing questions and answers (mid-tier) – possibly a new level of authorisation
c.	Ability to save scores associated with user IDs - possibly have a scoresheet available as well – Or create an API that allows users to send score data over to the software they use for grading
2.	Multiple teachers would be able to access different quizzes - Adding an auth per quiz and allowing users to assign other users to certain quizzes would improve user experience
3.	CMS for user management - can include batch creating, assigning to groups, password resets, viewing all users, etc
4.	Allow teachers to access multiple groups of students - This project works on the assumption that each teacher will only work with one group of students where real-life use case a teacher might work with different groups of students. It would be good to add a feature where teachers can create groups of students and save quizzes associated with each group.
5.	Self-led user creation - Could be done using an invite code or based on email address - Would require further research into how to ensure only users that need access get access
6.	Automating password reset and allowing users to set their own passwords - In a real-scale project this would need to be priority for data protection
7.	Mobile view/tablet view – Educational institutions are using tablets frequently now, would be good to accommodate so teachers can have more flexibility to work on quizzes rather than only allowing them to do so with access to a computer/laptop
8.	Option to print from directly within the app instead of going through the browser
9.	Using SVGs for logos as opposed to PNG files – Allows scalability for different screen sizes

## Acknowledgments

* [Thank you to Bryan Dijkhuizen from Medium for helping me learn more about hooking up to Mongo](https://javascript.plainenglish.io/create-an-authentication-api-using-node-js-express-mongodb-and-jwt-1d52124d402e)
