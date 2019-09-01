# ChatApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# 3813ICT-Assignment

**Author:** Tim Jones

**Student Number:** s5098470

## Data Structures

### Client-side
**Objects**

User class
* `username: string;`
* `email: string;`
* `role: string;`
* `groups: Group[];`
* `channels: Channel[];`

Group class
* `groupID: number;`
* `groupName: string;`

Channel class
* `groupID: number;`
* `groupName: string;`
* `channelID: number;`
* `channelName: string;`

Current User object
* with User class attributes

**Routes**
* `LoginComponent` route which sits at the root path, displays only if user is logged in
* `GroupComponent` route 

**Arrays**
* users
* groups
* channels

**Strings** 
* variable for authenticated
* to see if there is a user currently signed in or not. 
* for REST API's

### Server-side
Arrays for 
* users
* groups
* channels

JSON objects
* parse strings to get from file
* stringify object to pass data to file

Node FS
* file system use to read or write data to files


## Client/Server Interaction

Each different key element (user, group, channel) has its own route where data is received/distributed. Each element starts with a variable which holds all data pertaining to the related element. The variable is an object which the key of the principle variable equals an array of each element. 

For example, the global var for users is `var userList = { users: [] }`. As a new user is entered, the new user is pushed into the array, the array is serialized using JSON.stringify, and then written to the text file holding users. When a user is to be updated, the POST request gets all users data from the client side. The data is pushed to the userList which is now holding the current data in the user form fields. The userList containing updated data is then serialized to a string to be written back into the user’s text file. Now the next time all users are called to be displayed, the file will contain the latest updated data for the client side to see. For a user to be deleted, a similar process occurs however the userList is now holding the current users text file data. An index splice is used on the index of the userList, where the index is requested user from the client side is currently placed in the userList. 

These same principles apply for groups and channels also. However, due to there being 3 separate text files, when a group or channel is updated or deleted, the users text file is read, stored to a new array of users, and the group or channel within the user is updated or deleted to ensure consistency across the file system.
On the client side, a similar process occurs. An empty list for each element is used to pass incoming data through, and loop through to display on the web page.

## Client/Server Responsibilities

Three separate files were used that utilised RESTfull API to pass data from the server to the client. The files separate the users, groups and channels data handling. When the client side requests data, the server passes the text in the file to a JSON object. It then serves the GET request from the client and sends the JSON object/s to the client. When a user/group/channel is to be added, updated or deleted, the client sends a POST request through the HTTPClient module to the specified URL route that connects the corresponding server-side route. The REST API sends back data to the client.

## Angular Architecture


## Node Server Archtiecture


## GIT

