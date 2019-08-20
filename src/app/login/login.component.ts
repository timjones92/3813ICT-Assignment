import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../users';
import { Group, Channel } from '../groups';
import { ChannelService } from '../services/channel.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = "";
  authenticated: string;
  
  // Check if current user function
  readLocalStorageValue(key) {
    return localStorage.getItem(key);
  }

  // Initial Groups
  group = [
    new Group("B-Sharps"), 
    new Group("AlphaOmega")
  ];
  

  // Initial Super User
  users = [
    new User("Super", "superadmin@chatapp.com", "SuperAdmin", this.group, this.channelService.getChannels())
  ]

  constructor(private router:Router, private channelService: ChannelService) { }
  
  ngOnInit(){
    this.authenticated = this.readLocalStorageValue('username');
  }

  getData() {
    var getUser = this.username;
    var groupList = []
    var channelList = []

    this.channelService.getChannels

    if (this.users.some(person => (person.username == getUser))) {
      var currentUser = this.users.find(u => u.username == this.username)
      localStorage.setItem("username", currentUser.username);
      localStorage.setItem("email", currentUser.email);
      localStorage.setItem("role", currentUser.role);
      for (let i = 0; i < currentUser.groups.length; i++) {
        groupList.push(currentUser.groups[i].groupName);
      }
      localStorage.setItem("groups", JSON.stringify(groupList));
      for (let i = 0; i < currentUser.channels.length; i++) {
        var storeChannel = {group: "", id: 0, name: ""}
        storeChannel.group = currentUser.channels[i].groupName;
        storeChannel.id = currentUser.channels[i].channelID;
        storeChannel.name = currentUser.channels[i].channelName;
        channelList.push(storeChannel)
      }
      localStorage.setItem("channels", JSON.stringify(channelList));
      location.reload();
    }
  }
}
