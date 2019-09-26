import { Component, OnInit} from '@angular/core';
import { UserService } from '../services/user.service';
import { GroupsService } from '../services/groups.service';
import { ChannelService } from '../services/channel.service';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  localUsername = "";
  users = [];
  userGroups = [];
  userChannels = [];
  currentUser = {
    '_id': "",
    'username': "",
    'password': "",
    'email': "",
    'role': "",
    'avatar': ""
  };
  
  authenticated: string;
  
  // Check if current user function
  readLocalStorageValue(key) {
    return localStorage.getItem(key);
  }

  constructor(private userData: UserService, private groupData: GroupsService, private channelData: ChannelService) { }

  ngOnInit() {
    this.authenticated = this.readLocalStorageValue('username');

    if (typeof(Storage) !== "undefined"){
      this.localUsername = localStorage.getItem("username");
    }

    // Get all group users
    this.groupData.getGroupUsersList().subscribe(data => {
      this.userGroups = data;
    });

    // Get all channel users
    this.channelData.getChannelUsersList().subscribe(data => {
      this.userChannels = data;
    });

    // Get all users on init load of page
    this.userData.getUsersList().subscribe(data => {
      if (data !== null) {
        this.users = data;
        // Get current user from all users and add to variable `currentUser`
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].username === this.localUsername) {
            this.currentUser = this.users[i];
          }
        }
        console.log("Current User:", this.currentUser);
      }
    });
  }

  
}
