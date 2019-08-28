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
    this.admin = this.readLocalStorageValue('role');
    
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
      }
    });
  }

  /**
  ********************************
  ***** GROUPS DATA HANDLING *****
  ********************************
  */
  addNewGroup() {
    let newGroup = new Group("");
    
    const dialogRef = this.dialog.open(GroupDialog, {
      height: '400px',
      width: '600px',
      data: {groupName: newGroup.groupName}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      newGroup.groupName = result
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
    console.log(index);
    this.http.post(this.deleteGroupURL, this.groups[index], this.httpOptions).subscribe(
      data => {
        console.log(data);
        location.reload();
      }
    );
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
      this.http.post(this.addUserToGroupURL, {group: this.groups[index].groupName, user: result}, this.httpOptions).subscribe(
        data => {
          console.log(data)
          location.reload();
        }
      );
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

  constructor(
    public userDialogRef: MatDialogRef<UserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData) {}

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
