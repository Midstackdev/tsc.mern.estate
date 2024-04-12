# Express NoFramework Framework

This project is intended to be used as a boilerplate for creating Express API's or backend applications. The code is written in Typescript and uses and an opinionated, object oriented approach to development. It comes with features to interact with MongoDB using Mongoose. 

To get started run:
```bash
npm install
npm run watch
npm run watch:dev
```

## Files and Folders
---
The Inspiration from the structure and achitecture of this boilerplate is from the Laravel Framework.

### app/

This is the core of the application where the file are sepreated into folders with specific responsiibilty functions. 

---

### Launcher.ts

Entry point for NodeJS to run the Express application. Use this file to create an App instance. 

---
### Server/Server.ts

This is where the configuration and the setup of the application is, connect to database and get the app to listn on provided port number. 

---

### Http/

This folder houses controllers, middlewares and request validation folders which hosts files for single responsibility purposes to build an array of middleware to be used at the app level (implemented with all routes) of your express application.

---

### routes/

Create a router file based on the template for each grouping of routes in your application from the single reponsible controller. Add the exported express router to the array in the app instance object in the `index.ts` file

---

### libs/

This is a folder for creating reusable libraries that is needed for the base of the application to function. 

---

### config/

The configuraton of drop in replacemnet of database or third party library configurations can be done here.  
The `index.ts` file here hosts all the `.env` values for export for useage in the application.

---

### Models/

Create a model file for each model in your database. Use the `BaseModel` class to provide reusable CRUD funcitonality to each model to help stay DRY.

