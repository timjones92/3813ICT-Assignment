import { Component, OnInit, Inject } from '@angular/core';
import { Group, Channel } from '../groups';
import { User } from '../users';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
  
  groups = [];
  users = [];
  channels = [];
  currentUser = {username: "", email: "", role: "", groups: [], channels: []};
  currentUserGroups = [];

  url = "http://localhost:3000/";
  // Groups URLs
  getallGroupsURL = this.url + "api/getAllGroups/";
  saveUrl = this.url + "api/saveGroup/";
  getURL = this.url + "api/getGroup/";
  updateGroupURL = this.url + "api/updateGroup/";
  deleteGroupURL = this.url + "api/deleteGroup/";

  // Users URLs
  getallUsersURL = this.url + "api/getAllUsers/";
  saveUserUrl = this.url + "api/saveUser/";
  getUserURL = this.url + "api/getUser/";
  updateUserURL = this.url + "api/updateUser/";
  deleteUserURL = this.url + "api/deleteUser/";
  addUserToGroupURL = this.url + "api/addUserToGroup/";
  deleteUserFromGroupURL = this.url + "api/deleteUserFromGroup/";

  // Channels URLs
  getallChannelsURL = this.url + "api/getAllChannels/";
  saveChannelUrl = this.url + "api/saveChannel/";
  getChannelURL = this.url + "api/getChannel/";
  updateChannelsURL = this.url + "api/updateChannels/";
  deleteChannelURL = this.url + "api/deleteChannel/";
  addUserToChannelURL = this.url + "api/addUserToChannel/";
  deleteUserFromChannelURL = this.url + "api/deleteUserFromChannel/";

  authenticated: string;
  admin: string;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  
  // Check if current user function
  readLocalStorageValue(key) {
    return localStorage.getItem(key);
  }

  constructor(
    public dialog: MatDialog,
    private http: HttpClient
    ) { }

  ngOnInit() {
    this.authenticated = this.readLocalStorageValue('username');
    
    // Get all groups on init load of page
    this.http.get(this.getallGroupsURL).subscribe(data => {
      console.log(data)
      if (data !== null) {
        this.groups = data['groups'];
      }
    });

    // Get all users on init load of page
    this.http.get(this.getallUsersURL).subscribe(data => {
      console.log(data)
      if (data !== null) {
        this.users = data['users'];
        // Get current user from all users and add to variable `currentUser`
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].username === this.authenticated) {
            this.currentUser = this.users[i]
          }
        }
        for (let g = 0; g < this.groups.length; g++) {
          if (this.currentUser.groups.find(x=> x.groupID === this.groups[g].groupID) !== undefined) {
            this.currentUserGroups.push(this.currentUser.groups.find(x=> x.groupID === this.groups[g].groupID))
          } else {
            this.currentUserGroups.push({groupID: -1, groupName: ""})
          }
        }
      }
    });

    // Get all channels on init load of page
    this.http.get(this.getallChannelsURL).subscribe(data => {
      console.log(data);
      if (data !== null) {
        this.channels = data['channels'];
      }
    });
    
    console.log("Current User groups are:", this.currentUserGroups)
  }

  /**
  ********************************
  ***** GROUPS DATA HANDLING *****
  ********************************
  */
  addNewGroup() {
    let newGroup = new Group(0,"");
    
    const dialogRef = this.dialog.open(GroupDialog, {
      height: '400px',
      width: '600px',
      data: {groupName: newGroup.groupName}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      let range = Array.from(Array(this.groups.length).keys())
      for (let i = 0; i < this.groups.length; i++) {
        if (this.groups[i].groupID in range) {
          newGroup.groupID = this.groups.length
        } else {
          newGroup.groupID = i
        }
      }
      newGroup.groupName = result;
      if (result !== undefined) {
        this.http.post(this.saveUrl, JSON.stringify(newGroup), this.httpOptions).subscribe(    
          data => {
            console.log(data);
            this.http.get(this.getURL).subscribe(data => {
              console.log(data['groups'])
              this.groups = data['groups'];
              location.reload();
            });
          },    
          (err: HttpErrorResponse) => {      
            console.log(err.error);    
          }
        );
        if (this.groups.length === 0) {
          setTimeout(function() {
            location.reload();
          }, 200);
        }
      }
      
    });
    
  }

  updateGroups() {
    this.http.post(this.updateGroupURL, JSON.stringify(this.groups), this.httpOptions).subscribe(
      data => {
        console.log(data);
        location.reload();
      }
    );
    
  }

  deleteGroup(group) {
    let index = this.groups.indexOf(group);
    if (confirm("Are you sure you want to delete the " + group.groupName + " group?" +
    "\nWARNING: This will cause all channels in the group to be deleted.")) {
      this.http.post(this.deleteGroupURL, this.groups[index], this.httpOptions).subscribe(
        data => {
          console.log(data);
          location.reload();
        }
      );
    }
  }

  /**
  *******************************
  ***** USERS DATA HANDLING *****
  *******************************
  */
  addNewUser() {
    let newUser = new User("", "", "", Group[""], Channel[""]);
    
    const userDialogRef = this.dialog.open(UserDialog, {
      height: '400px',
      width: '600px',
      data: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      }
    });
    
    userDialogRef.afterClosed().subscribe(result => {
      newUser = result;
      if (result !== undefined) {
        if (this.users.find(x => x.username === result.username)) {
          alert("This username is already taken! Please enter a valid username.");
        } else {
          this.http.post(this.saveUserUrl, JSON.stringify(newUser), this.httpOptions).subscribe(    
            data => {
              console.log(data);
              this.http.get(this.getUserURL).subscribe(data => {
                console.log(data['users'])
                this.groups = data['users'];
                location.reload();
              });
            },    
            (err: HttpErrorResponse) => {      
              console.log(err.error);    
            }
          );
          if (this.users.length === 0) {
            setTimeout(function() {
              location.reload();
            }, 200);
          }
        }
      }
        
        
      
    });
    
  }

  updateUsers() {
    this.http.post(this.updateUserURL, JSON.stringify(this.users), this.httpOptions).subscribe(
      data => {
        console.log(data);
        location.reload();
      }
    );
    
  }

  deleteUser(user) {
    let index = this.users.indexOf(user);
    console.log(index);
    this.http.post(this.deleteUserURL, this.users[index], this.httpOptions).subscribe(
      data => {
        console.log(data);
        location.reload();
      }
    );
  }

  addUserToGroup(group) {
    const addGroupUserDialogRef = this.dialog.open(AddGroupUserDialog, {
      height: '400px',
      width: '600px',
      data: {
        users: this.users,
        groupName: group.groupName
      }
    });
    addGroupUserDialogRef.afterClosed().subscribe(result => {
      console.log(result);
      let index = this.groups.indexOf(group);
      if (result !== undefined) {
        this.http.post(this.addUserToGroupURL, {groupID: this.groups[index].groupID, groupName: this.groups[index].groupName, user: result}, this.httpOptions).subscribe(
          data => {
            console.log(data)
            location.reload();
          }
        );
      }
    });
  }

  deleteUserFromGroup(group) {
    var matchingUsers = []
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].groups) {
        if (this.users[i].groups.find(x => x.groupID === group.groupID) !== undefined) {
          matchingUsers.push(this.users[i])
        }
      }
    }
    //console.log(matchingUsers)
    const deleteUserFromGroupDialogRef = this.dialog.open(DeleteUserFromGroupDialog, {
      height: '400px',
      width: '600px',
      data: {
        users: matchingUsers,
        groupID: group.groupID,
        groupName: group.groupName
      }
    });
    deleteUserFromGroupDialogRef.afterClosed().subscribe(result => {
      console.log(result)
      let index = this.groups.indexOf(group);
      if (result !== undefined) {
        this.http.post(this.deleteUserFromGroupURL, {groupID: this.groups[index].groupID, groupName: this.groups[index].groupName, user: result}, this.httpOptions).subscribe(
          data => {
            console.log(data)
            location.reload();
          }
        );
      }
    });
  }

  /**
  **********************************
  ***** CHANNELS DATA HANDLING *****
  **********************************
  */
  addNewChannel() {
    let newChannel = new Channel(0,"", 0, "");
    
    const dialogRef = this.dialog.open(AddChannelDialog, {
      height: '400px',
      width: '600px',
      data: {groups: this.groups, channelGroup: Object, channelName: newChannel.channelName}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      let range = Array.from(Array(this.channels.length).keys())
      //console.log(result)
      for (let i = 0; i < this.channels.length; i++) {
        if (this.channels[i].channelID in range) {
          newChannel.channelID = this.channels.length
        } else {
          newChannel.channelID = i
        }
      }
      newChannel.channelName = result.channelName;
      newChannel.groupName = result.channelGroup.groupName;
      newChannel.groupID = result.channelGroup.groupID;
      console.log("New Channel is:", newChannel)
      if (result !== undefined) {
        this.http.post(this.saveChannelUrl, JSON.stringify(newChannel), this.httpOptions).subscribe(    
          data => {
            console.log(data);
            this.http.get(this.getChannelURL).subscribe(data => {
              console.log(data['channels'])
              this.channels = data['channels'];
              location.reload();
            });
          },    
          (err: HttpErrorResponse) => {      
            console.log(err.error);    
          }
        );
        if (this.groups.length === 0) {
          setTimeout(function() {
            location.reload();
          }, 200);
        }
      }
      
    });
  }

  updateChannels() {
    this.http.post(this.updateChannelsURL, JSON.stringify(this.channels), this.httpOptions).subscribe(
      data => {
        console.log(data);
        location.reload();
      }
    );
  }

  deleteChannel(channel) {
    let index = this.channels.indexOf(channel);
    if (confirm("Are you sure you want to delete the " + channel.channelName + " channel?")) {
      this.http.post(this.deleteChannelURL, this.channels[index], this.httpOptions).subscribe(
        data => {
          console.log(data);
          location.reload();
        }
      );
    }
  }

  addUserToChannel(channel) {
    
    const addChannelUserDialogRef = this.dialog.open(AddChannelUserDialog, {
      height: '400px',
      width: '600px',
      data: {
        users: this.users,
        channelName: channel.channelName
      }
    });
    addChannelUserDialogRef.afterClosed().subscribe(result => {
      console.log(result);
      let index = this.channels.indexOf(channel);
      if (result !== undefined) {
        this.http.post(this.addUserToChannelURL, {
          groupID: this.channels[index].groupID, 
          groupName: this.channels[index].groupName, 
          channelID: this.channels[index].channelID,
          channelName: this.channels[index].channelName,
          user: result
        }, this.httpOptions).subscribe(
          data => {
            console.log(data)
            location.reload();
          }
        );
      }
    });
  }

  deleteUserFromChannel(channel) {
    var matchingUsers = []
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].channels) {
        if (this.users[i].channels.find(x => x.channelID === channel.channelID) !== undefined) {
          matchingUsers.push(this.users[i])
        }
      }
      
    }
    //console.log(matchingUsers)
    const deleteUserFromChannelDialogRef = this.dialog.open(DeleteUserFromChannelDialog, {
      height: '400px',
      width: '600px',
      data: {
        users: matchingUsers,
        channelID: channel.groupID,
        channelName: channel.groupName
      }
    });
    deleteUserFromChannelDialogRef.afterClosed().subscribe(result => {
      console.log(result)
      let index = this.channels.indexOf(channel);
      if (result !== undefined) {
        this.http.post(this.deleteUserFromChannelURL, 
          {
            channelID: this.channels[index].channelID, 
            channelName: this.channels[index].channelName, 
            user: result
          }, this.httpOptions).subscribe(
          data => {
            console.log(data)
            location.reload();
          }
        );
      }
    });
  }

}

// Groups Dialog class
export interface DialogData {
  groupName: string;
}

@Component({
  selector: 'group-dialog',
  templateUrl: 'group-dialog.html',
})

export class GroupDialog {

  constructor(
    public dialogRef: MatDialogRef<GroupDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

}

// Users Dialog class
export interface UserDialogData {
  username: string;
  email: string;
  role: string;
}

@Component({
  selector: 'user-dialog',
  templateUrl: 'user-dialog.html',
})

export class UserDialog {

  useUrl = "http://localhost:3000/api/getAllUsers/";
  allUsrs = [];
  currentUsr: string;
  auth: string;

  // Check if current user function
  readLocalStorageValue(key) {
    return localStorage.getItem(key);
  }

  constructor(
    public userDialogRef: MatDialogRef<UserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData,
    private http: HttpClient) {}

  ngOnInit() {
    this.auth = this.readLocalStorageValue('username');
    // Get all users on init load of page
    this.http.get(this.useUrl).subscribe(data => {
      if (data !== null) {
        this.allUsrs = data['users'];
        // Get current user from all users and add to variable `currentUser`
        for (let i = 0; i < this.allUsrs.length; i++) {
          if (this.allUsrs[i].username === this.auth) {
            this.currentUsr = this.allUsrs[i]
          }
        }
      }
    });
  }
  onCancelClick(): void {
    this.userDialogRef.close();
  }
}

// AddGroupUser Dialog class
export interface AddGroupUserDialogData {
  users: [Object];
  groupName: string;
}

@Component({
  selector: 'addGroupUserDialog',
  templateUrl: 'addGroupUserDialog.html',
})

export class AddGroupUserDialog {

  constructor(
    public addGroupUserDialogRef: MatDialogRef<AddGroupUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddGroupUserDialogData) {}
    
  onCancelClick(): void {
    this.addGroupUserDialogRef.close();
  }
}

// DeleteUserFromGroup Dialog class
export interface DeleteUserFromGroupDialogData {
  users: [Object];
  groupName: string;
}

@Component({
  selector: 'deleteUserFromGroupDialog',
    templateUrl: 'deleteUserFromGroupDialog.html',
})

export class DeleteUserFromGroupDialog {

  constructor(
    public deleteUserFromGroupDialogRef: MatDialogRef<DeleteUserFromGroupDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteUserFromGroupDialogData) {}
    
  onCancelClick(): void {
    this.deleteUserFromGroupDialogRef.close();
  }
}

// Channels Dialog class
export interface AddChannelDialogData {
  groups: [Object];
  channelGroup: Object;
  channelName: string;
}

@Component({
  selector: 'addChannelDialog',
  templateUrl: 'addChannelDialog.html',
})

export class AddChannelDialog {

  constructor(
    public addChannelDialogRef: MatDialogRef<AddChannelDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddChannelDialogData) {}

  onCancelClick(): void {
    this.addChannelDialogRef.close();
  }
}

// AddChannelUser Dialog class
export interface AddChannelUserDialogData {
  users: [Object];
  channelName: string;
}

@Component({
  selector: 'addChannelUserDialog',
  templateUrl: 'addChannelUserDialog.html',
})

export class AddChannelUserDialog {

  constructor(
    public addChannelUserDialogRef: MatDialogRef<AddChannelUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddChannelUserDialogData) {}
    
  onCancelClick(): void {
    this.addChannelUserDialogRef.close();
  }
}

// DeleteUserFromChannel Dialog class
export interface DeleteUserFromChannelDialogData {
  users: [Object];
  channelName: string;
}

@Component({
  selector: 'deleteUserFromChannelDialog',
  templateUrl: 'deleteUserFromChannelDialog.html',
})

export class DeleteUserFromChannelDialog {

  constructor(
    public deleteUserFromChannelDialogRef: MatDialogRef<DeleteUserFromChannelDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteUserFromChannelDialogData) {}
    
  onCancelClick(): void {
    this.deleteUserFromChannelDialogRef.close();
  }
}
