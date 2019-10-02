import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Group, Channel } from '../groups';
import { User } from '../users';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { GroupsService } from '../services/groups.service';
import { UserService } from '../services/user.service';
import { ChannelService } from '../services/channel.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
  
  groups: Group[] = [];
  users: User[] = [];
  channels: Channel[] = [];
  userGroups = [];
  userChannels = [];
  currentUser = {username: "", email: "", role: "", avatar: "", groupAssis: false};
  groupAssisList = [];
  mySubscription: any;
  authenticated: string;
  admin: string;
  
  // Check if current user function
  readLocalStorageValue(key) {
    return localStorage.getItem(key);
  }

  constructor(
    public dialog: MatDialog,
    private groupsData: GroupsService,
    private userData: UserService,
    private channelData: ChannelService,
    private router: Router
    ) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      
      this.mySubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          // Trick the Router into believing it's last link wasn't previously loaded
          this.router.navigated = false;
        }
      });
     }

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
            this.currentUser.username = this.users[i].username;
            this.currentUser.email = this.users[i].email;
            this.currentUser.role = this.users[i].role;
            this.currentUser.avatar = this.users[i].avatar;
          }
        }
      }
    });

    // Get all channels on init load of page
    this.channelData.getChannelsList().subscribe(data => {
      if (data !== null) {
        this.channels = data;
        console.log('All current channels are:', this.channels)
      }
    });

    // Get all group users
    this.groupsData.getGroupUsersList().subscribe(data => {
      if (data !== null) {
        this.userGroups = data;
        console.log("Current group users are:", this.userGroups)
      }
    });

    // Get all channel users
    this.channelData.getChannelUsersList().subscribe(data => {
      if (data !== null) {
        this.userChannels = data;
        console.log("Current channel users are:", this.userChannels);
      }
    });

    // Get all group assistants
    this.groupsData.getGroupAssisList().subscribe(data => {
      if (data != null) {
        this.groupAssisList = data;
        console.log("Group Assis list:", this.groupAssisList);
        for (let i in this.groupAssisList) {
          if (this.groupAssisList[i].username === this.currentUser.username) {
            this.currentUser.groupAssis = true;
            console.log("Curr:", this.currentUser)
          }
        }
      }
    });
    
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
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
        // Send new group to server to add to db
        this.groupsData.addNewGroup(newGroup).subscribe((data) => {
          if (data.err == null) {
            this.groups = data;
          } else {
            alert(data.err);
          }
        });
      }
      
    });
    
  }

  updateGroups() {
    this.groupsData.updateGroups(this.groups).subscribe(data => {
      this.groups = data.gdata;
      this.channels = data.cdata;
      this.userGroups = data.ugdata;
      this.userChannels = data.ucdata;
      this.groupAssisList = data.gadata;
    });
    
  }

  deleteGroup(group) {
    console.log('Group to be deleted:', group)
    if (confirm("Are you sure you want to delete this group?" +
    "\nWARNING: This will cause all channels in the group to be deleted.")) {
      this.groupsData.deleteGroup(group).subscribe(data => {
        console.log("Returned delete group data:", data);
        this.groups = data.gdata;
        this.channels = data.cdata;
        this.userGroups = data.ugdata;
        this.userChannels = data.ucdata;
      });
    }
  }

  addUserToGroup(group) {
    let invalidGroupUsers = [];
    let validGroupUsers = [];
    // Get all group users that are in selected group
    for (let i = 0; i < this.userGroups.length; i++) {
      if(this.userGroups[i].groupID === group.groupID) {
        invalidGroupUsers.push(this.userGroups[i].username);
      }
    }
    // Filter out users already in selected group from list of all users
    for (let i = 0; i < this.users.length; i++) {
      if (!invalidGroupUsers.includes(this.users[i].username)) {
        validGroupUsers.push(this.users[i]);
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
      if(this.userGroups[i].groupID === group.groupID) {
        validGroupUsers.push(this.userGroups[i]);
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
            this.userGroups = data.ugdata;
            this.userChannels = data.ucdata;
            this.groupAssisList = data.gadata;
          }
        );
      }
    });
  }

  addNewGroupAssis(group) {
    let invalidGroupAssis = [];
    let validUsers = [];
    let stillValid = [];
    // Find users who are already Group Assis in selected group
    for (let i = 0; i < this.groupAssisList.length; i++) {
      if(this.groupAssisList[i].groupID === group.groupID) {
        invalidGroupAssis.push(this.groupAssisList[i].username);
      }
    }

    // Find users who are in the selected group
    for (let i = 0; i < this.userGroups.length; i++) {
      if(this.userGroups[i].groupID === group.groupID) {
        validUsers.push(this.userGroups[i].username);
      }
    }
    
    // Valid user must have role user
    for (let index in this.users) {
      // if not already a Group Assis
      if (!invalidGroupAssis.includes(this.users[index].username)) {
        // If in selected group
        if (validUsers.includes(this.users[index].username)) {
          // if role is normal user
          if (this.users[index].role === 'User') {
            stillValid.push(this.users[index]);
          }
        }
      }
    }

    const addGroupAssisDialogRef = this.dialog.open(AddGroupAssisDialog, {
      height: '400px',
      width: '600px',
      data: {
        users: stillValid,
        group: group
      }
    });

    addGroupAssisDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let newGroupAssis = result;
        this.groupsData.addGroupAssis(group, newGroupAssis).subscribe(data => {
          this.groupAssisList = data;
        });
      }
    });
  }

  deleteGroupAssis(group) {
    let validGroupAssis = [];

    // Find users who are already Group Assis in selected group
    for (let i = 0; i < this.groupAssisList.length; i++) {
      if(this.groupAssisList[i].groupID === group.groupID) {
        validGroupAssis.push(this.groupAssisList[i]);
      }
    }

    const deleteGroupAssisDialogRef = this.dialog.open(DeleteGroupAssisDialog, {
      height: '400px',
      width: '600px',
      data: {
        groupAssis: validGroupAssis,
        group: group
      }
    });

    deleteGroupAssisDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let groupAssisToDelete = result;
        this.groupsData.deleteGroupAssis(groupAssisToDelete).subscribe(data => {
          this.groupAssisList = data;
        });
      }
    });
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
        // Send user to server to add to db
        this.userData.addNewUser(newUser).subscribe(    
          data => {
            this.users = data;
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
        this.users = data.udata;
        this.userGroups = data.ugdata;
        this.userChannels = data.ucdata;
      }
    );
    setTimeout(() => {
      this.router.navigateByUrl("/");
    }, 300)
    
  }

  deleteUser(user) {
    if (confirm("Are you sure you want to delete " + user.username + "?")) {
      this.userData.deleteUser(user).subscribe(data => {
        this.users = data.udata;
        this.userGroups = data.ugdata;
        this.userChannels = data.ucdata;
        this.groupAssisList = data.gadata;
      });
    }
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
    this.channelData.updateChannels(this.channels).subscribe(data => {
        this.channels = data.cdata;
        this.userChannels = data.ucdata;
    });
  }

  deleteChannel(channel) {
    if (confirm("Are you sure you want to delete the " + channel.channelName + " channel?"
    + "\nWARNING: All channel users will be deleted from channel.")) {
      this.channelData.deleteChannel(channel).subscribe(data => {
        this.channels = data.cdata;
        this.userChannels = data.ucdata;
      });
    }
  }

  addUserToChannel(channel) {
    let invalidChannelUsers = [];
    let validChannelUsers = [];
    // Get all channel users that are in selected channel
    for (let i = 0; i < this.userChannels.length; i++) {
      if (this.userChannels[i].channelID === channel.channelID) {
        invalidChannelUsers.push(this.userChannels[i].username);
      }
    }

    // Filter out users if they are not currently in the group
    for (let i = 0; i < this.userGroups.length; i++) {
      if (this.userGroups[i].groupID === channel.groupID) {
        if (!invalidChannelUsers.includes(this.userGroups[i].username)) {
          validChannelUsers.push({'userID':this.userGroups[i].userID, 'username':this.userGroups[i].username})
        }
      }
    }

    const addChannelUserDialogRef = this.dialog.open(AddChannelUserDialog, {
      height: '400px',
      width: '600px',
      data: {
        users: validChannelUsers,
        channelName: channel.channelName
      }
    });
    addChannelUserDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        //console.log(result);
        let user = result;
        let group = {'groupID': channel.groupID, 'groupName': channel.groupName};
        this.channelData.addNewUserToChannel(channel, group, user).subscribe(
          data => {
            this.userChannels = data;
          }
        );
      }
    });
  }

  deleteUserFromChannel(channel) {
    let validChannelUsers = [];
    // Get all channel users that are in selected channel
    for (let i = 0; i < this.userChannels.length; i++) {
      if(this.userChannels[i].channelID === channel.channelID) {
        validChannelUsers.push({'userID': this.userChannels[i].userID, 'username': this.userChannels[i].username});
      }
    }
    
    const deleteUserFromChannelDialogRef = this.dialog.open(DeleteUserFromChannelDialog, {
      height: '400px',
      width: '600px',
      data: {
        users: validChannelUsers,
        channelName: channel.channelName
      }
    });
    deleteUserFromChannelDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let user = result;
        let group = channel.groupID;
        this.channelData.deleteUserFromChannel(channel, group, user).subscribe(
          data => {
            this.userChannels = data;
          }
        );
      }
    });
  }

}

// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Add New Group Dialog class \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
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
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Add New User Dialog class \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
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
  invalidUser: string;
  usernameErrorMsg: string = "";

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

  onKey(event) {
    if (this.allUsrs.find(x => x.username === event)) {
      this.invalidUser = event;
      this.usernameErrorMsg = "Username already exists. Please choose a different username."
    } else {
      this.invalidUser = "";
    }
  }

  onCancelClick(): void {
    this.userDialogRef.close();
  }
}

// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// AddGroupUser Dialog class \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
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

// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// DeleteUserFromGroup Dialog class \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
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
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Add New Channel Dialog class \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
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

// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// AddChannelUser Dialog class \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
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
    
  ngOnInit() {

  }

  onCancelClick(): void {
    this.addChannelUserDialogRef.close();
  }
}

// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// DeleteUserFromChannel Dialog class \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
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

// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Add Group Assis Dialog class \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
export interface AddGroupAssisDialogData {
  users: [User];
  groups: [Group];
}

@Component({
  selector: 'addGroupAssisDialog',
  templateUrl: 'addGroupAssisDialog.html',
})

export class AddGroupAssisDialog {

  constructor(
    public addGroupAssisDialogRef: MatDialogRef<AddGroupAssisDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddGroupAssisDialogData) {}
    
  ngOnInit() {

  }

  onCancelClick(): void {
    this.addGroupAssisDialogRef.close();
  }
}


// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Delete Group Assis Dialog class \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
export interface DeleteGroupAssisDialogData {
  groupAssis: [Object];
  group: Group;
}

@Component({
  selector: 'deleteGroupAssisDialog',
  templateUrl: 'deleteGroupAssisDialog.html',
})

export class DeleteGroupAssisDialog {

  constructor(
    public deleteGroupAssisDialogRef: MatDialogRef<DeleteGroupAssisDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteGroupAssisDialogData) {}
    
  ngOnInit() {

  }

  onCancelClick(): void {
    this.deleteGroupAssisDialogRef.close();
  }
}