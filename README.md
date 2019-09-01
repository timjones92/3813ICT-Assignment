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
* `LoginComponent` route path at root of site, displays only if user is not logged in.
* `GroupComponent` route path at root of site, with outlet, displays only if user is logged in. This is the route that shows the currently logged in user the groups and channels they are currently in.
* `AdminComponent` route path at root of site, with outlet, displays only if user is logged in. This is the route that displays forms to add/edit/delete Users, Groups and Channels depending on role of current user.
* `ChannelComponent` routes to the path `channels/:id` where the id is the `channelID` of the channel selected. This route uses sockets to display chat messages for any observer.

**HTTPClient**
* `GET` and `POST` HTTPClient calls to call to server routes

**Arrays**
* users
* groups
* channels

**Strings** 
* variable for authenticated - to see if there is a user currently signed in or not. 
* URLs for REST API's (see server-side routes)

### Server-side
**Objects**

JSON objects
* parse strings to get from file
* stringify object to pass data to file

**Routes**

*Users*
* Method: `GET` Route: `/api/getAllUsers` - get all users from users text file (`users.txt`) and return data to client.
* Method: `POST` Route: `/api/saveUser` - gets a POST request from client where client is sending the username, email and role of new user from new user form field. Reads all existing users from `users.txt`, push to `userList` array, push new user to `userList` array, then write back over `users.txt` the updated `userList` array.
* Method: `GET` Route: `/api/getUser` - returns the new user from server-side to the client.
* Method: `POST` Route: `/api/updateUser` - gets a POST request from client where client is sending all users in the current form field. The current data for all users is then written to file to overwrite the existing users in `users.txt`.
* Method: `POST` Route: `/api/deleteUser` - gets a POST request from client where the client is sending the user object of the selected user to be deleted. The existing users in `users.txt` is pushed to `userList`, and the index of the received user to be deleted is found. The user is spliced by received user index position, and then updated `userList` is written back to `users.txt`.
* Method: `POST` Route: `/api/addUserToGroup` - get a POST request from client where client is sending the `groupID` and `groupName` of the group to add the user to, plus the users username. The route then finds the user object from `userList` where user object username = received username, then pushes the received group to the received user.
* Method: `POST` Route: `/api/deleteUserFromGroup` - get a POST request from client where client is sending the `groupID` and `groupName` of the group to delete the user from, and also the user's username to delete. The route then finds the user object from `userList` where user object username = received username, splices the received group from the received user, and writes back to `users.txt` with updated data.

*Groups*
* Method: `GET` Route: `/api/getAllGroups` - get all groups from groups text file (`groups.txt`) and return data to client.
* Method: `POST` Route: `/api/saveGroup` - gets a POST request from client where client is sending the group id and group name of new group from new group form field. Reads all existing groups from `groups.txt`, push to `groupList` array, push new group to `groupList` array, then write back over `groups.txt` the updated `groupList` array.
* Method: `GET` Route: `/api/getGroup` - returns the new group from server-side to client-side once new group is written in `groups.txt`.
* Method: `POST` Route: `/api/updateGroup` - gets a POST request from client where client is sending all groups in the current form field. The current data for all groups is then written to file to overwrite the existing groups in `groups.txt`.
* Method: `POST` Route: `/api/deleteGroup` - gets a POST request from client where the client is sending the group object of the selected group to be deleted. The existing groups in `groups.txt`, and the index of the received group to be deleted is found. The group is spliced by received group index position, and then updated `groupList` is written back to `groups.txt`.

*Channels*
* Method: `GET` Route: `/api/getAllChannels` - get all channels from channels text file (`channels.txt`) and return data to client.
* Method: `POST` Route: `/api/saveChannel` - gets a POST request from client where client is sending the group id, group name, channel id and channel name of new channel from new channel form field. Reads all existing channels from `channels.txt`, push to `channelList` array, push new channel to `channelList` array, then write back over `channels.txt` the updated `channelList` array.
* Method: `GET` Route: `/api/getChannel` - returns the new channel from server-side to the client.
* Method: `POST` Route: `/api/updateChannels` - gets a POST request from client where client is sending all channels in the current form field. The current data for all channels is then written to file to overwrite the existing channels in `users.txt`.
* Method: `POST` Route: `/api/deleteChannel` - gets a POST request from client where the client is sending the channel object of the selected channel to be deleted. The existing channels in `channels.txt` is pushed to `channelList`, and the index of the received channel to be deleted is found. The channel is spliced by received channel index position, and then updated `channelList` is written back to `channels.txt`.
* Method: `POST` Route: `/api/addUserToChannel` - get a POST request from client where client is sending the `groupID`, `groupName`, `channelID` and `channelName` of the channel to add the user to, plus the user's username. The route then finds the user object from `userList` where user object username = received username, then pushes the received channel to the received user.
* Method: `POST` Route: `/api/deleteUserFromChannel` - get a POST request from client where client is sending the `groupID`, `groupName`, `channelID` and `channelName` of the channel to delete the user from, and also the user's username to delete. The route then finds the user object from `userList` where user object username = received username, splices the received channel from the received user, and writes back to `channels.txt` with updated data.

**Arrays**
* users
* groups
* channels

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

