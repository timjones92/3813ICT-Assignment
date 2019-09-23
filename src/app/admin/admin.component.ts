import { Component, OnInit, Inject } from '@angular/core';
import { Group, Channel } from '../groups';
import { User } from '../users';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { GroupsService } from '../services/groups.service';
import { UserService } from '../services/user.service';
import { ChannelService } from '../services/channel.service';
import { invalid } from '@angular/compiler/src/render3/view/util';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
  
  groups: Group[] = [];
  users: User[] = [];
  channels: Channel[] = [];
  userGroups = []
  currentUser = {username: "", email: "", role: "", avatar: ""};
  currentUserGroups = [];
  groupAssis = {groupID: 0, groupName: "", username: ""};
  groupAssisList = [];

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
    private groupsData: GroupsService,
    private userData: UserService,
    private channelData: ChannelService
    ) { }

  ngOnInit() {
    this.authenticated = this.readLocalStorageValue('username');
    
    // Get all groups on init load of page
    this.groupsData.getGroupsList().subscribe((data) => {
      this.groups = data;
      console.log("All groups:", this.groups);
    });

    // Get all users on init load of page
    this.userData.getUsersList().subscribe(data => {
      if (data !== null) {
        this.users = data;
        // Get current user from all users and add to variable `currentUser`
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].username === this.authenticated) {
            this.currentUser = this.users[i]
          }
        }
        // for (let g = 0; g < this.groups.length; g++) {
        //   if (this.currentUser.groups.find(x=> x.groupID === this.groups[g].groupID) !== undefined) {
        //     this.currentUserGroups.push(this.currentUser.groups.find(x=> x.groupID === this.groups[g].groupID))
        //   } else {
        //     this.currentUserGroups.push({groupID: -1, groupName: ""})
        //   }
        // }
      }
    });

    // Get all channels on init load of page
    this.channelData.getChannelsList().subscribe(data => {
      if (data !== null) {
        this.channels = data;
      }
    });
    
    console.log("Current User groups are:", this.currentUserGroups)

    // Get all group users
    this.groupsData.getGroupUsersList().subscribe(data => {
      if (data !== null) {
        this.userGroups = data;
        console.log("Current group users are:", this.userGroups)
      }
    });
    
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
        this.groups.push(newGroup);
        // Send new group to server to add to db
        this.groupsData.addNewGroup(newGroup).subscribe((data) => {
          if (data.err == null) {
            alert(data.num + " new group (" + newGroup.groupName + ") was added.");
          } else {
            alert(data.err);
          }
        });
      }
      
    });
    
  }

  updateGroups() {
    this.groupsData.updateGroups(this.groups).subscribe(
      data => {
        console.log(data);
        alert("Updated all Groups.")
      }
    );
    
  }

  deleteGroup(group) {
    if (confirm("Are you sure you want to delete this group?" +
    "\nWARNING: This will cause all channels in the group to be deleted.")) {
      this.groupsData.deleteGroup(group).subscribe(data => {
        this.groups = data;
      });
    }
  }

  addGroupAssis() {
    this.groupAssis
  }

  /**
  *******************************
  ***** USERS DATA HANDLING *****
  *******************************
  */
  addNewUser() {
    let newUser = new User("", "password", "", "", "");
    
    const userDialogRef = this.dialog.open(UserDialog, {
      height: '400px',
      width: '600px',
      data: {
        username: newUser.username,
        password: newUser.password,
        email: newUser.email,
        role: newUser.role
      }
    });
    
    userDialogRef.afterClosed().subscribe(result => {
      newUser = result;
      if (result !== undefined) {
        newUser.avatar = '../assets/default-avatar.jpg';
        this.users.push(newUser);
        // Send user to server to add to db
        this.userData.addNewUser(newUser).subscribe(    
          data => {
            console.log("Added new user:", data);
          },    
          (err: HttpErrorResponse) => {      
            console.log(err.error);    
        });
      }
    });
    
  }

  updateUsers() {
    this.userData.updateUsers(this.users).subscribe(
      data => {
        alert("Updated all users");
        console.log(data)
      }
    );
    
  }

  deleteUser(user) {
    if (confirm("Are you sure you want to delete " + user.username + "?")) {
      this.userData.deleteUser(user).subscribe(data => {
        this.users = data;
      });
    }
  }

  addUserToGroup(group) {
    let invalidGroupUsers = [];
    let validGroupUsers = [];
    // Get all group users that are in selected group
    for (let i = 0; i < this.userGroups.length; i++) {
      if(this.userGroups[i].group === group.groupID) {
        invalidGroupUsers.push(this.userGroups[i].user);
      }
    }
    // Filter out users already in selected group from list of all users
    for (let i = 0; i < this.users.length; i++) {
      if (!invalidGroupUsers.includes(this.users[i].username)) {
        validGroupUsers.push(this.users[i].username)
      }
    }
    
    // Open dialog to add user to group
    const addGroupUserDialogRef = this.dialog.open(AddGroupUserDialog, {
      height: '400px',
      width: '600px',
      data: {
        users: validGroupUsers,
        groupName: group.groupName
      }
    });
    addGroupUserDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        //console.log(result);
        let user = result;
        this.groupsData.addNewUserToGroup(group, user).subscribe(
          data => {
            this.userGroups = data;
          }
        );
      }
    });
  }

  deleteUserFromGroup(group) {
    let validGroupUsers = [];
    // Get all group users that are in selected group
    for (let i = 0; i < this.userGroups.length; i++) {
      if(this.userGroups[i].group === group.groupID) {
        validGroupUsers.push(this.userGroups[i].user);
      }
    }
    
    const deleteUserFromGroupDialogRef = this.dialog.open(DeleteUserFromGroupDialog, {
      height: '400px',
      width: '600px',
      data: {
        users: validGroupUsers,
        groupID: group.groupID,
        groupName: group.groupName
      }
    });
    deleteUserFromGroupDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let user = result;
        this.groupsData.deleteUserFromGroup(group, user).subscribe(
          data => {
            this.userGroups = data;
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
      if (result !== undefined) {
        let range = Array.from(Array(this.channels.length).keys())
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
        this.channels.push(newChannel)
        
        this.channelData.addNewChannel(newChannel).subscribe(    
          data => {
            console.log("Added new channel:", data);
          },    
          (err: HttpErrorResponse) => {      
            console.log(err.error);    
          }
        );
      }
    });
      
  }

  updateChannels() {
    this.channelData.updateChannels(this.channels).subscribe(
      data => {
        alert("Updated all channels.");
      }
    );
  }

  deleteChannel(channel) {
    if (confirm("Are you sure you want to delete the " + channel.channelName + " channel?")) {
      this.channelData.deleteChannel(channel).subscribe(
        data => {
          this.channels = data;
        }
      );
    }
  }

  // addUserToChannel(channel) {
    
  //   const addChannelUserDialogRef = this.dialog.open(AddChannelUserDialog, {
  //     height: '400px',
  //     width: '600px',
  //     data: {
  //       users: this.users,
  //       channelName: channel.channelName
  //     }
  //   });
  //   addChannelUserDialogRef.afterClosed().subscribe(result => {
  //     console.log(result);
  //     let index = this.channels.indexOf(channel);
  //     if (result !== undefined) {
  //       this.http.post(this.addUserToChannelURL, {
  //         groupID: this.channels[index].groupID, 
  //         groupName: this.channels[index].groupName, 
  //         channelID: this.channels[index].channelID,
  //         channelName: this.channels[index].channelName,
  //         user: result
  //       }, this.httpOptions).subscribe(
  //         data => {
  //           console.log(data)
  //           location.reload();
  //         }
  //       );
  //     }
  //   });
  // }

  // deleteUserFromChannel(channel) {
  //   var matchingUsers = []
  //   for (let i = 0; i < this.users.length; i++) {
  //     if (this.users[i].channels) {
  //       if (this.users[i].channels.find(x => x.channelID === channel.channelID) !== undefined) {
  //         matchingUsers.push(this.users[i])
  //       }
  //     }
      
  //   }
  //   //console.log(matchingUsers)
  //   const deleteUserFromChannelDialogRef = this.dialog.open(DeleteUserFromChannelDialog, {
  //     height: '400px',
  //     width: '600px',
  //     data: {
  //       users: matchingUsers,
  //       channelID: channel.groupID,
  //       channelName: channel.groupName
  //     }
  //   });
  //   deleteUserFromChannelDialogRef.afterClosed().subscribe(result => {
  //     console.log(result)
  //     let index = this.channels.indexOf(channel);
  //     if (result !== undefined) {
  //       this.http.post(this.deleteUserFromChannelURL, 
  //         {
  //           channelID: this.channels[index].channelID, 
  //           channelName: this.channels[index].channelName, 
  //           user: result
  //         }, this.httpOptions).subscribe(
  //         data => {
  //           console.log(data)
  //           location.reload();
  //         }
  //       );
  //     }
  //   });
  // }

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
  password: string;
  email: string;
  role: string;
}

@Component({
  selector: 'user-dialog',
  templateUrl: 'user-dialog.html',
})

export class UserDialog {

  allUsrs: User[] = [];
  currentUsr: User = new User("", "", "", "GroupAdmin", "");
  auth: string;

  // Check if current user function
  readLocalStorageValue(key) {
    return localStorage.getItem(key);
  }

  constructor(
    public userDialogRef: MatDialogRef<UserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData,
    private userData: UserService) {}

  ngOnInit() {
    this.auth = this.readLocalStorageValue('username');
    // Get all users on init load of page
    this.userData.getUsersList().subscribe(data => {
      if (data !== null) {
        this.allUsrs = data;
        // Get current user from all users and add to variable `currentUser`
        for (let i = 0; i < this.allUsrs.length; i++) {
          if (this.allUsrs[i].username === this.auth) {
            this.currentUsr = this.allUsrs[i];
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

  useUrl = "http://localhost:3000/api/getAllUsers/";
  groupUrl = "http://localhost:3000/api/getAllGroups/";
  allUsrs = [];
  allGrps = [];
  validUsers = [];

  constructor(
    public addChannelUserDialogRef: MatDialogRef<AddChannelUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddChannelUserDialogData, 
    private http: HttpClient) {}
    
  ngOnInit() {
    // Get all users on init load of page
    this.http.get(this.useUrl).subscribe(data => {
      if (data !== null) {
        this.allUsrs = data['users'];
        this.http.get(this.groupUrl).subscribe(groups => {
          if (groups !== null) {
            this.allGrps = groups['groups'];
            // Get current user from all users and add to variable `currentUser`
            for (let i = 0; i < this.allUsrs.length; i++) {
              for (let g = 0; g < this.allGrps.length; g++) {
                if (this.allUsrs[i].groups.find(x => x.groupID === this.allGrps[g].groupID)) {
                  this.validUsers.push(this.allUsrs[i]);
                }
              }
              
            }
          }
        });
          
      }
    });
  }

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
